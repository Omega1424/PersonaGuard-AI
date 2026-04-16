"""
Session and user management endpoints for PersonaGuard AI.
"""
import random
import logging
from fastapi import APIRouter, HTTPException

from app import db
from app.services import chat_service
from app.models.schemas import (
    UserInitRequest, UserInitResponse,
    SessionStartRequest, SessionStartResponse,
    RevealRequest, RevealResponse,
    UserStatsResponse,
)

router = APIRouter()
logger = logging.getLogger(__name__)

VALID_PERSONAS = {"ahbeng", "xmm", "spf"}


# ─── User endpoints ────────────────────────────────────────────────────────────

@router.post("/user/init", response_model=UserInitResponse)
def user_init(request: UserInitRequest):
    """Create user if not exists; return user record."""
    user = db.upsert_user(request.user_id)
    return UserInitResponse(
        user_id=user["user_id"],
        module_completed=bool(user["module_completed"]),
    )


@router.get("/user/{user_id}/stats", response_model=UserStatsResponse)
def user_stats(user_id: str):
    """Return full stats for a user."""
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.get_user_stats(user_id)


@router.post("/user/{user_id}/module-complete")
def module_complete(user_id: str):
    """Mark the awareness module as completed for this user."""
    user = db.get_user(user_id)
    if not user:
        # Auto-create the user rather than failing
        db.upsert_user(user_id)
    db.mark_module_complete(user_id)
    return {"status": "ok", "module_completed": True}


# ─── Session endpoints ─────────────────────────────────────────────────────────

@router.post("/session/start", response_model=SessionStartResponse)
def session_start(request: SessionStartRequest):
    """
    Start a new conversation session.
    Randomly assigns scam or legit mode (hidden from frontend until reveal).
    Generates and returns the persona's opening message.
    """
    if request.persona not in VALID_PERSONAS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown persona '{request.persona}'. Valid: {VALID_PERSONAS}"
        )

    # Ensure user exists
    db.upsert_user(request.user_id)

    # Coinflip — equal probability
    mode = random.choice(["scam", "legit"])
    awareness_answered = "yes" if request.awareness_completed else "no"

    try:
        session_id, first_message = chat_service.start_session(
            user_id=request.user_id,
            persona=request.persona,
            mode=mode,
            awareness_answered=awareness_answered,
        )
    except Exception as e:
        logger.error(f"Failed to start session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return SessionStartResponse(session_id=session_id, first_message=first_message)


@router.post("/session/{session_id}/reveal", response_model=RevealResponse)
def session_reveal(session_id: str, request: RevealRequest):
    """
    Finalise session with user's guess; return reveal data + red flags.
    """
    if request.user_guess not in ("scam", "legit"):
        raise HTTPException(
            status_code=400,
            detail="user_guess must be 'scam' or 'legit'"
        )

    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        result = chat_service.reveal(session_id, request.user_guess)
    except Exception as e:
        logger.error(f"Reveal failed for {session_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return result
