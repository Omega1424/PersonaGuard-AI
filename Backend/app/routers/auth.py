"""
Auth endpoints — register and login with username + SHA-256 hashed password.
Uses stdlib hashlib with a random salt (no external dependencies).
"""
import hashlib
import secrets
import logging
from fastapi import APIRouter, HTTPException

from app import db
from app.models.schemas import RegisterRequest, LoginRequest, AuthResponse

router = APIRouter()
logger = logging.getLogger(__name__)


def _hash(password: str) -> str:
    """Return 'salt:sha256hash' string."""
    salt = secrets.token_hex(16)
    digest = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{digest}"


def _verify(plain: str, stored: str) -> bool:
    """Verify a plain password against a stored 'salt:hash' string."""
    try:
        salt, digest = stored.split(":", 1)
        return hashlib.sha256((salt + plain).encode()).hexdigest() == digest
    except Exception:
        return False


@router.post("/auth/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    username = req.username.strip()
    if not username or not req.password:
        raise HTTPException(status_code=400, detail="Username and password are required")
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    if db.get_user_by_username(username):
        raise HTTPException(status_code=409, detail="Username already taken")

    user = db.create_user(username, _hash(req.password))
    logger.info(f"New user registered: {username}")
    return AuthResponse(user_id=user["user_id"], username=user["username"])


@router.post("/auth/login", response_model=AuthResponse)
def login(req: LoginRequest):
    user = db.get_user_by_username(req.username.strip())
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if not _verify(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    logger.info(f"User logged in: {user['username']}")
    return AuthResponse(user_id=user["user_id"], username=user["username"])
