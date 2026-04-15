from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    role: MessageRole
    content: str


# ─── Legacy (kept for /chat/singlish etc.) ────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    safety: str
    timestamp: datetime


class HealthCheck(BaseModel):
    status: str
    timestamp: datetime = datetime.now()


class ErrorResponse(BaseModel):
    error: str
    message: str
    timestamp: datetime = datetime.now()


# ─── New session-based schemas ────────────────────────────────────────────────

class UserInitRequest(BaseModel):
    user_id: str


class UserInitResponse(BaseModel):
    user_id: str
    module_completed: bool


class SessionStartRequest(BaseModel):
    user_id: str
    persona: str  # ahbeng | xmm | spf | singlish
    awareness_completed: bool  # what the user answered to the awareness check


class SessionStartResponse(BaseModel):
    session_id: str
    first_message: str


class SessionChatRequest(BaseModel):
    session_id: str
    message: str


class SessionChatResponse(BaseModel):
    response: str
    safety: str
    message_count: int       # number of user messages sent so far (1-indexed)
    session_complete: bool   # True when message_count == 30
    timestamp: datetime


class RevealRequest(BaseModel):
    user_guess: str  # "scam" | "legit"


class RedFlag(BaseModel):
    phrase: str
    message_index: int
    explanation: str


class ScoreUpdate(BaseModel):
    total_completed: int
    accuracy: Optional[float]
    current_streak: int
    scam_detection_rate: Optional[float]


class RevealResponse(BaseModel):
    actual_mode: str          # "scam" | "legit"
    guess_correct: bool
    red_flags: List[RedFlag]
    score_update: ScoreUpdate


class UserStatsResponse(BaseModel):
    total_completed: int
    accuracy: Optional[float]
    accuracy_by_persona: Dict[str, Optional[float]]
    pre_module_accuracy: Optional[float]
    post_module_accuracy: Optional[float]
    current_streak: int
    best_streak: int
    scam_detection_rate: Optional[float]
    false_positive_rate: Optional[float]
    sessions: List[Dict[str, Any]]
