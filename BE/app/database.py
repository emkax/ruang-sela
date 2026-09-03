import json
import pathlib
from typing import List, Dict, Any, Optional
from functools import lru_cache

from app.config import get_settings

# Optional supabase import — graceful fallback to local JSON
try:
    from supabase import create_client, Client  # type: ignore
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False
    Client = Any  # type: ignore

_supabase_client: Optional[Any] = None

def get_supabase() -> Optional[Any]:
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    settings = get_settings()
    if not HAS_SUPABASE or not settings.supabase_configured():
        return None
    key = settings.supabase_service_key or settings.supabase_anon_key
    try:
        _supabase_client = create_client(settings.supabase_url, key)  # type: ignore
        return _supabase_client
    except Exception as e:
        print(f"[DB] supabase init failed: {e}")
        return None

# Local JSON fallback — load ruangsela_DKI_bulk75_cookie_75.json
_LOCAL_CACHE: Optional[List[Dict[str, Any]]] = None

def _resolve_data_path() -> pathlib.Path:
    settings = get_settings()
    candidates = [
        pathlib.Path(settings.data_path),
        pathlib.Path("data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
        pathlib.Path("../data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
        pathlib.Path("E:/scraping_gmaps/data/raw/ruangsela_DKI_bulk75_cookie_75.json"),
    ]
    for p in candidates:
        if p.exists():
            return p
    # fallback absolute
    return pathlib.Path("data/raw/ruangsela_DKI_bulk75_cookie_75.json")

def load_local_places() -> List[Dict[str, Any]]:
    global _LOCAL_CACHE
    if _LOCAL_CACHE is not None:
        return _LOCAL_CACHE
    path = _resolve_data_path()
    if not path.exists():
        print(f"[DB] data file not found: {path}")
        _LOCAL_CACHE = []
        return _LOCAL_CACHE
    data = json.loads(path.read_text(encoding="utf-8"))
    _LOCAL_CACHE = data
    return data

def fetch_places(limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """Fetch places: prefer Supabase, fallback local JSON."""
    sb = get_supabase()
    if sb is not None:
        try:
            q = sb.table("places").select("*")
            if limit:
                q = q.limit(limit)
            res = q.execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"[DB] supabase fetch failed, fallback local: {e}")
    return load_local_places()[:limit] if limit else load_local_places()

def count_places() -> int:
    sb = get_supabase()
    if sb is not None:
        try:
            res = sb.table("places").select("id", count="exact").execute()
            if res.count is not None:
                return res.count
        except:
            pass
    return len(load_local_places())

# In-memory embeddings store for local mode
_EMB_CACHE: Optional[Dict[str, Any]] = None

def load_local_embeddings() -> Dict[str, list]:
    """Load precomputed embeddings if exists (BE/eval/embeddings.json). Else empty."""
    p = pathlib.Path("BE/eval/embeddings.json")
    alt = pathlib.Path("eval/embeddings.json")
    for cand in [p, alt, pathlib.Path("BE/embeddings.json")]:
        if cand.exists():
            try:
                return json.loads(cand.read_text(encoding="utf-8"))
            except:
                pass
    return {}
