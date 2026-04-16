"""
Chat router — session-based chat endpoint.
"""
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    HealthCheck,
    SessionChatRequest, SessionChatResponse,
)
from app.services import chat_service
from app import db

router = APIRouter()
logger = logging.getLogger(__name__)

VALID_PERSONAS = {"ahbeng", "xmm", "spf"}

# ─── Primary session-based endpoint ───────────────────────────────────────────

@router.post("/chat/{persona}", response_model=SessionChatResponse)
def chat_persona(persona: str, request: SessionChatRequest):
    """
    Send a message in an active session.
    persona path param is kept for routing clarity but the actual persona
    is determined by the session stored in the DB.
    """
    if not request.session_id:
        raise HTTPException(status_code=400, detail="session_id is required")

    session = db.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.get("completed_at"):
        raise HTTPException(status_code=400, detail="Session already completed — start a new one")

    try:
        result = chat_service.chat(request.session_id, request.message)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return SessionChatResponse(
        response=result["response"],
        safety=result["safety"],
        message_count=result["message_count"],
        session_complete=result["session_complete"],
        timestamp=datetime.now(),
    )


# ─── Health check ──────────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthCheck)
def health_check():
    return HealthCheck(status="healthy", timestamp=datetime.now())


@router.get("/model-status")
def model_status():
    return {"status": "ok", "backend": "huggingface-spaces"}


@router.get("/")
def chat_info():
    return {
        "message": "PersonaGuard AI API",
        "version": "3.0.0",
        "endpoints": {
            "session_start": "POST /api/session/start",
            "chat": "POST /api/chat/{persona}",
            "reveal": "POST /api/session/{id}/reveal",
            "user_stats": "GET /api/user/{id}/stats",
            "health": "GET /api/health",
        },
        "personas": list(VALID_PERSONAS),
        "status": "operational",
    }
