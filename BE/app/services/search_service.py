import re
import math
import time
from typing import List, Dict, Any, Optional, Tuple

import numpy as np

from app.services.embed_service import embed_query, cosine_sim, build_place_content, embed_texts
from app.database import fetch_places

# Precompute embeddings cache for local mode (lazy)
_PLACE_EMB_CACHE: Optional[Dict[str, List[float]]] = None
_PLACE_CONTENT_CACHE: Optional[Dict[str, str]] = None

def _ensure_local_embeddings():
    global _PLACE_EMB_CACHE, _PLACE_CONTENT_CACHE
    if _PLACE_EMB_CACHE is not None:
        return
    places = fetch_places()
    # Build content
    contents = {}
    for p in places:
        pid = p.get("place_id") or p.get("nama") or str(id(p))
        contents[pid] = build_place_content(p)
    # Try to load precomputed from file to avoid recompute
    try:
        import pathlib, json
        emb_path = pathlib.Path("BE/eval/embeddings.json")
        alt = pathlib.Path("eval/embeddings.json")
        pre = None
        for cand in [emb_path, alt]:
            if cand.exists():
                pre = json.loads(cand.read_text(encoding="utf-8"))
                break
        if pre and len(pre) == len(contents):
            _PLACE_CONTENT_CACHE = contents
            _PLACE_EMB_CACHE = pre
            print(f"[SEARCH] Loaded precomputed embeddings {len(pre)}")
            return
    except Exception as e:
        print(f"[SEARCH] precomputed load failed: {e}")

    # Compute on-the-fly (fallback dummy or real IndoBERT)
    print(f"[SEARCH] Computing embeddings for {len(contents)} places (first run may take time)...")
    texts = list(contents.values())
    pids = list(contents.keys())
    vecs = embed_texts(texts, batch_size=8)
    _PLACE_EMB_CACHE = {pid: vec for pid, vec in zip(pids, vecs)}
    _PLACE_CONTENT_CACHE = contents

def parse_hour_from_text(text: str) -> Optional[int]:
    if not text:
        return None
    low = text.lower()
    m = re.search(r"(?:jam|pukul)\s*(\d{1,2})(?:[:\.]\d{0,2})?", low)
    if m:
        try:
            h = int(m.group(1))
            if 0 <= h <= 23:
                return h
        except:
            pass
    return None

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def extract_busy_percent(place: Dict[str, Any], target_hour: int) -> Optional[int]:
    """Parse popular_times string for hour percent."""
    raw = place.get("popular_times") or place.get("jam_ramai") or ""
    if not raw:
        return None
    # pattern "31% ramai pada pukul 12.00"
    # also "14% ramai pada pukul 12.00"
    m = re.search(rf"{target_hour}[^\d%]*(\d+)%\s*ramai", raw)
    # more robust: search "pukul 12.00" nearby number
    if not m:
        # try generic: find all "X% ramai pada pukul Y"
        for mm in re.finditer(r"(\d+)%\s*ramai\s*pada\s*pukul\s*(\d+)", raw):
            if int(mm.group(2)) == target_hour:
                return int(mm.group(1))
        return None
    # above strict not matched, use found
    # Actually if pattern is "31% ramai pada pukul 12.00", the % is before pukul, so previous regex above is reversed.
    # Try second loop already.
    return None

def extract_busy_percent_v2(place: Dict[str, Any], target_hour: int) -> Optional[int]:
    raw = place.get("popular_times") or place.get("jam_ramai") or ""
    if not raw:
        return None
    # All occurrences
    for m in re.finditer(r"(\d+)%\s*ramai\s*pada\s*pukul\s*(\d+)", raw):
        try:
            pct = int(m.group(1))
            hr = int(m.group(2))
            if hr == target_hour:
                return pct
        except:
            continue
    return None

def compute_facility_bonus(place: Dict[str, Any], query_lower: str) -> Tuple[float, Dict[str, Any]]:
    """Soft bonus: if query mentions ac/parkir, boost if place has it. No hard elimination."""
    fasilitas = place.get("fasilitas") or []
    fac_text = " ".join(fasilitas).lower()
    reviews_text = " ".join([(r.get("text") or "") for r in (place.get("reviews") or [])]).lower()
    content_lower = (fac_text + " " + reviews_text).lower()

    bonus = 0.0
    evidence = {}

    # AC signals: ac, ber ac, ber-ac, sejuk, dingin, air conditioner, blower
    ac_query = any(k in query_lower for k in [" ac", "ac ", "ber-ac", "ber ac", "sejuk", "dingin", "berac", "air conditioner"])
    # But even if query not explicit, content with AC still general semantic; for soft we only boost if query wants AC
    # If query contains AC-like, check place
    if ac_query:
        # check fasilitas exact AC or review mentions
        has_ac_fac = any("ac" == f.lower().strip() for f in fasilitas)
        has_ac_review = any(x in reviews_text for x in [" ac ", "ber-ac", "ber ac", "sejuk", "dingin", "air conditioner", "blower"])
        # Also check content
        if has_ac_fac:
            bonus += 0.15
            evidence["ac"] = "fasilitas AC eksplisit"
        elif has_ac_review:
            bonus += 0.10
            evidence["ac"] = "ulasan menyebut AC/sejuk"
        else:
            # penalty small if query asks AC but place has no signal
            bonus -= 0.05
            evidence["ac"] = "tidak ada sinyal AC"
    else:
        # query not about AC, but place with AC gets tiny generic bonus? no
        pass

    # Parkir signals
    parkir_query = any(k in query_lower for k in ["parkir", "parking", "tempat lega", "lahan parkir"])
    if parkir_query:
        has_parkir_fac = any("parkir" in f.lower() for f in fasilitas) and not any(f.lower().startswith("tidak memiliki") and "parkir" in f.lower() for f in fasilitas)
        # review mention
        has_parkir_review = "parkir" in reviews_text
        # lega/luas signals
        lega_in_review = any(x in reviews_text for x in ["parkir luas", "parkir lega", "parkir besar", "kapasitas parkir"])
        sempit_in_review = any(x in reviews_text for x in ["parkir kurang luas", "parkir sempit", "parkir sampai di pinggir jalan", "parkir penuh"])
        if has_parkir_fac and lega_in_review:
            bonus += 0.12
            evidence["parkir"] = "parkir ada + ulasan luas/lega"
        elif has_parkir_fac and not sempit_in_review:
            bonus += 0.10
            evidence["parkir"] = "fasilitas parkir ada"
        elif has_parkir_fac and sempit_in_review:
            bonus += 0.02  # parkir ada tapi sempit, small bonus
            evidence["parkir"] = "parkir ada tapi ulasan sempit"
        elif has_parkir_review:
            bonus += 0.05
            evidence["parkir"] = "ulasan menyebut parkir"
        else:
            bonus -= 0.03
            evidence["parkir"] = "tidak ada parkir"
        # extra lega bonus
        if "lega" in query_lower or "luas" in query_lower:
            if lega_in_review:
                bonus += 0.05
            if sempit_in_review:
                bonus -= 0.08

    return bonus, evidence

def hybrid_search(
    query_text: str,
    top_k: int = 10,
    mode: str = "hybrid",
    target_hour: Optional[int] = None,
    user_lat: Optional[float] = None,
    user_lng: Optional[float] = None,
    radius_m: Optional[int] = None,
) -> List[Dict[str, Any]]:
    start = time.time()
    _ensure_local_embeddings()
    places = fetch_places()
    if not places:
        return []

    query_lower = query_text.lower()
    # auto parse hour if not given but text contains jam
    if target_hour is None:
        target_hour = parse_hour_from_text(query_text)

    # Embed query
    q_vec = embed_query(query_text)

    # Try supabase vector search first if available (not implemented for local fallback)
    # For local, compute cosine manually for all
    scored = []
    for p in places:
        pid = p.get("place_id") or p.get("nama")
        content = _PLACE_CONTENT_CACHE.get(pid, build_place_content(p)) if _PLACE_CONTENT_CACHE else build_place_content(p)
        p_vec = _PLACE_EMB_CACHE.get(pid) if _PLACE_EMB_CACHE else None
        if p_vec is None:
            # fallback single
            p_vec = embed_texts([content])[0]
        sim = cosine_sim(q_vec, p_vec)

        # Mode handling
        if mode == "relational":
            # relational approx: keyword overlap
            # simple: count matching tokens
            sim = 0.0  # ignore vector
            # boost if query tokens in content
            qtokens = set(re.findall(r"\w+", query_lower))
            ctokens = set(re.findall(r"\w+", content.lower()))
            overlap = len(qtokens & ctokens) / max(1, len(qtokens))
            sim = overlap  # 0-1
        elif mode == "vector":
            # pure vector, no bonuses
            pass

        # hybrid bonuses (only for hybrid)
        facility_bonus = 0.0
        evidence: Dict[str, Any] = {}
        busy_bonus = 0.0
        geo_bonus = 0.0
        busy_pct = None
        distance_km = None

        if mode == "hybrid":
            facility_bonus, ev = compute_facility_bonus(p, query_lower)
            evidence.update(ev)
            # busy bonus
            if target_hour is not None:
                busy_pct = extract_busy_percent_v2(p, target_hour)
                if busy_pct is not None:
                    # empty = low percent good. Threshold 25 sepi, 40 sedang, >60 ramai
                    # bonus = (40 - pct)/40  -> 0.375 for 25%, 0.225 for 31%, negative if >40
                    bb = (40 - busy_pct) / 40.0
                    # clip -0.3 to 0.4
                    bb = max(-0.3, min(0.4, bb))
                    busy_bonus = bb * 0.15  # scale 0.15 weight
                    evidence["busy"] = f"jam {target_hour}: {busy_pct}% ramai"
                    # if query says "kosong" or "sepi", extra weight
                    if any(k in query_lower for k in ["kosong", "sepi", "lega", "tidak ramai"]):
                        busy_bonus *= 1.5
                else:
                    evidence["busy"] = f"jam {target_hour}: data tidak tersedia (netral)"
            # geo bonus
            if user_lat is not None and user_lng is not None and p.get("lat") and p.get("lng"):
                try:
                    dist = haversine_km(user_lat, user_lng, float(p["lat"]), float(p["lng"]))
                    distance_km = dist
                    # if radius given and beyond, penalty not eliminate (soft)
                    if radius_m and dist*1000 > radius_m:
                        # soft penalty beyond radius, not eliminate
                        geo_bonus = -0.05
                        evidence["geo"] = f"{dist:.1f}km di luar radius {radius_m}m"
                    else:
                        # closer = higher bonus, 0km=0.1, 10km=0
                        geo_bonus = max(0, (10 - dist) / 10) * 0.05
                        evidence["geo"] = f"{dist:.1f}km"
                except:
                    pass
            # rating norm
            rating = p.get("rating") or 0
            rating_bonus = (rating / 5.0) * 0.05 if rating else 0
        else:
            facility_bonus = 0
            busy_bonus = 0
            geo_bonus = 0
            rating_bonus = 0

        if mode == "hybrid":
            final = 0.55 * sim + facility_bonus + busy_bonus + geo_bonus + rating_bonus
            # ensure not negative huge
            final = max(-0.5, final)
        elif mode == "vector":
            final = sim
        else:  # relational
            final = sim + (facility_bonus * 0.1)  # small

        scored.append({
            "place": p,
            "content": content,
            "sim": sim,
            "facility_bonus": facility_bonus,
            "busy_bonus": busy_bonus,
            "geo_bonus": geo_bonus,
            "final": final,
            "busy_pct": busy_pct,
            "distance_km": distance_km,
            "evidence": evidence,
        })

    # sort by final desc
    scored.sort(key=lambda x: x["final"], reverse=True)
    top = scored[:top_k]
    return top
