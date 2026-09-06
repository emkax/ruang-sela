"""
Vercel entry for FastAPI BE (Root Directory = "BE").
Vercel's Python builder requires a top-level `app` / `application` /
`handler` variable assigned unconditionally at module level.
"""
from app.main import app as _fastapi_app

app = _fastapi_app
application = app
handler = app
