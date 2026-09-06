"""
LLM Service — WAJIB calling API Google AI Studio (Gemini 2.5 Flash).
Jika tidak ada API key maka tidak jalan (raise 503). Tidak ada fallback heuristic untuk prod.
Model: gemini-2.5-flash (atau gemini-2.5-pro jika butuh reasoning lebih).
API Key: GEMINI_API_KEY atau GOOGLE_API_KEY dari https://aistudio.google.com/app/apikey
"""
import re
import os
import json
from typing import Dict, Any, Optional

from fastapi import HTTPException

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

def _get_gemini_key() -> Optional[str]:
    settings = get_settings()
    # prioritas: GEMINI_API_KEY > GOOGLE_API_KEY > OPENAI_API_KEY (backward compat jika user taruh Gemini key di OPENAI env)
    for k in ["GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENAI_API_KEY"]:
        v = getattr(settings, "gemini_api_key", None) if k == "GEMINI_API_KEY" else os.getenv(k)
        if v:
            return v
    v = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
    if v and v.startswith("AQ."):
        # Gemini key dari Google AI Studio format AQ.xxx dianggap valid
        return v
    return v

def llm_expand_query(data_text: str, profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """WAJIB calling API Gemini 2.5. Jika tidak ada API key atau call gagal maka raise 503, tidak fallback."""
    api_key = _get_gemini_key()
    if not api_key:
        # coba baca manual BE/.env untuk GEMINI_API_KEY
        try:
            import pathlib
            for cand in [pathlib.Path("BE/.env"), pathlib.Path(".env"), pathlib.Path("../.env")]:
                if cand.exists():
                    for line in cand.read_text(encoding="utf-8").splitlines():
                        if line.strip().startswith("GEMINI_API_KEY=") or line.strip().startswith("GOOGLE_API_KEY=") or line.strip().startswith("OPENAI_API_KEY="):
                            # ambil value jika format AQ.
                            val = line.split("=", 1)[1].strip().strip('"').strip("'")
                            if val.startswith("AQ.") or val.startswith("AIza"):
                                api_key = val
                                break
                    if api_key:
                        break
        except:
            pass
    if not api_key:
        raise HTTPException(status_code=503, detail="LLM API key not configured (GEMINI_API_KEY / GOOGLE_API_KEY wajib untuk Gemini 2.5) - calling API tidak jalan")

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        # Gunakan gemini-2.5-flash (cepat, murah) atau gemini-2.5-pro
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.2,
                "max_output_tokens": 512,
                "response_mime_type": "application/json",
            },
        )
        prompt = f"""
Kamu adalah parser intent pencarian ruang. Query: "{data_text}"
Profile user: {profile or {}}
Tugas: Ekstrak intent JSON dengan key: needs_ac (bool), needs_parking (bool), vibe_lega (bool), empty (bool), hour (int|null 0-23), expanded_query (string rewritten lebih jelas untuk embedding, Bahasa Indonesia).
Contoh: "ruangan AC parkir lega kosong jam 12" -> {{"needs_ac": true, "needs_parking": true, "vibe_lega": true, "empty": true, "hour": 12, "expanded_query": "ruangan ber-AC dengan parkir luas dan sepi pada jam 12 siang"}}
Hanya return JSON valid tanpa markdown.
"""
        resp = model.generate_content(prompt)
        txt = (resp.text or "").strip()
        # bersihkan markdown ```json wrapper jika ada
        if txt.startswith("```"):
            txt = re.sub(r"^```(?:json)?\s*", "", txt)
            txt = re.sub(r"\s*```$", "", txt)
        data = json.loads(txt)
        data.setdefault("expanded_query", data_text)
        if data.get("hour") is None:
            h = heuristic_intent(data_text).get("hour")
            if h is not None:
                data["hour"] = h
        # normalisasi bool
        for k in ["needs_ac", "needs_parking", "vibe_lega", "empty"]:
            if k in data and not isinstance(data[k], bool):
                data[k] = bool(data[k])
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Gemini 2.5 calling API gagal: {e} - tidak ada fallback")
