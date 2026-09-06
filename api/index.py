"""
Vercel entry for FastAPI BE - root level.
Handles both Root Directory = "/" (monorepo) and Root = "BE".
Vercel Python runtime expects `app` variable.
"""
import sys
import pathlib

# Add BE to path if deploying from root
be_path = pathlib.Path(__file__).resolve().parent.parent / "BE"
if str(be_path) not in sys.path:
    sys.path.insert(0, str(be_path))
# Also try parent (for Vercel with Root=BE, this is no-op)
root_be = pathlib.Path(__file__).resolve().parent / "app"
if root_be.exists() and str(pathlib.Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

try:
    from app.main import app  # noqa: F401
except ImportError:
    # Fallback for Root=BE where api/index.py is BE/api/index.py
    from BE.app.main import app  # type: ignore  # noqa: F401
