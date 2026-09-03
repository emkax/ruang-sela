"""
LLM Service — process search query before embedding.
- If OPENAI_API_KEY configured: call LLM to expand intent (needs_ac, needs_parking, hour, vibe) + query rewriting.
- Else fallback heuristic parsing (no LLM).
"""
import re
import os
from typing import Dict, Any, Optional

from app.config import get_settings

def heuristic_intent(data_text: str) -> Dict[str, Any]:
    low = data_text.lower()
    intent = {
        "needs_ac": any(k in low for k in [" ac ", " ac,", "ber-ac", "ber ac", "sejuk", "dingin", "air conditioner", "blower"]),
        "needs_parking": any(k in low for k in ["parkir", "parking", "lahan parkir"]),
        "vibe_lega": any(k in low for k in ["lega", "luas", "lapang", "besar"]),
        "empty": any(k in low for k in ["kosong", "sepi", "tidak ramai", "tidak penuh"]),
        "hour": None,
        "expanded_query": data_text,
    }
    m = re.search(r"(?:jam|pukul)\s*(\d{1,2})", low)
    if m:
        try:
            intent["hour"] = int(m.group(1))
        except:
            pass
    return intent

def llm_expand_query(data_text: str, profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    settings = get_settings()
    api_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
    # also try reading BE/.env manually
    if not api_key:
        try:
            import pathlib
            for cand in [pathlib.Path("BE/.env"), pathlib.Path(".env"), pathlib.Path("../.env")]:
                if cand.exists():
                    for line in cand.read_text(encoding="utf-8").splitlines():
                        if line.startswith("OPENAI_API_KEY="):
                            api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                            break
        except:
            pass
    if not api_key:
        return heuristic_intent(data_text)

    try:
        from openai import OpenAI
        import httpx
        # avoid proxies error on some httpx versions
        client = OpenAI(api_key=api_key, http_client=httpx.Client())
        prompt = f"""
Kamu adalah parser intent pencarian ruang. Query: "{data_text}"
Profile user: {profile or {}}
Tugas: Ekstrak intent JSON dengan key: needs_ac (bool), needs_parking (bool), vibe_lega (bool), empty (bool), hour (int|null 0-23), expanded_query (string rewritten lebih jelas untuk embedding, Bahasa Indonesia).
Contoh: "ruangan AC parkir lega kosong jam 12" -> {{"needs_ac": true, "needs_parking": true, "vibe_lega": true, "empty": true, "hour": 12, "expanded_query": "ruangan ber-AC dengan parkir luas dan sepi pada jam 12 siang"}}
Hanya return JSON.
"""
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=200,
            temperature=0.2,
        )
        import json
        txt = resp.choices[0].message.content
        data = json.loads(txt)
        # ensure defaults
        data.setdefault("expanded_query", data_text)
        data.setdefault("hour", heuristic_intent(data_text)["hour"])
        return data
    except Exception as e:
        print(f"[LLM] expand failed, fallback heuristic: {e}")
        return heuristic_intent(data_text)
