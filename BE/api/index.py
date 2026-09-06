"""
Vercel entry for FastAPI BE.
Vercel Python runtime expects a top-level `app` variable (ASGI).
Root Directory di Vercel = BE
"""
from app.main import app  # noqa: F401
