from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str

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