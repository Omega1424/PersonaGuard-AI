"""
Gemini-based session-aware chat service for PersonaGuard AI.
Uses the new google-genai SDK (replaces deprecated google-generativeai).
"""
import logging
from typing import List, Dict, Any, Tuple

from google import genai
from google.genai import types

from app import db
from app.config import settings
from app.services.prompts import SYSTEM_PROMPTS, scan_for_red_flags

logger = logging.getLogger(__name__)

MAX_USER_MESSAGES = 30
MODEL = "gemini-2.0-flash"

OPEN_TRIGGER = "Start the conversation now. Send your opening message as your character. Keep it brief and natural."


def _client() -> genai.Client:
    return genai.Client(api_key=settings.gemini_api_key)


def _build_history(stored_messages: List[Dict[str, Any]]) -> List[types.Content]:
    """Convert stored DB messages to Gemini Content objects, prepending the open trigger."""
    history = [types.Content(role="user", parts=[types.Part(text=OPEN_TRIGGER)])]
    for msg in stored_messages:
        role = "model" if msg["role"] == "assistant" else "user"
        history.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
    return history


def start_session(
    user_id: str,
    persona: str,
    mode: str,
    awareness_answered: str,
) -> Tuple[str, str]:
    session_id = db.create_session(user_id, persona, mode, awareness_answered)
    system_prompt = SYSTEM_PROMPTS[persona][mode]

    client = _client()
    response = client.models.generate_content(
        model=MODEL,
        contents=OPEN_TRIGGER,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
    )
    first_message = response.text.strip()

    db.add_message(session_id, "assistant", first_message, message_index=1)
    logger.info(f"[{session_id}] Session started — persona={persona} mode={mode}")
    return session_id, first_message


def chat(session_id: str, user_message: str) -> Dict[str, Any]:
    session = db.get_session(session_id)
    if not session:
        raise ValueError(f"Session {session_id} not found")
    if session.get("completed_at"):
        raise ValueError(f"Session {session_id} is already completed")

    persona = session["persona"]
    mode = session["mode"]
    system_prompt = SYSTEM_PROMPTS[persona][mode]

    stored = db.get_session_messages(session_id)
    next_index = len(stored) + 1

    db.add_message(session_id, "user", user_message, message_index=next_index)
    next_index += 1

    user_msg_count = db.count_user_messages(session_id)

    # History = everything stored except the last user message we just added
    stored_without_last = db.get_session_messages(session_id)[:-1]
    history = _build_history(stored_without_last)

    client = _client()
    chat_session = client.chats.create(
        model=MODEL,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
        history=history,
    )
    response = chat_session.send_message(user_message)
    assistant_text = response.text.strip()

    db.add_message(session_id, "assistant", assistant_text, message_index=next_index)

    if mode == "scam":
        for flag in scan_for_red_flags(persona, assistant_text, message_index=next_index):
            db.append_red_flag(session_id, flag)

    session_complete = user_msg_count >= MAX_USER_MESSAGES
    logger.info(f"[{session_id}] msg {user_msg_count}/{MAX_USER_MESSAGES} — complete={session_complete}")

    return {
        "response": assistant_text,
        "safety": "Safe",
        "message_count": user_msg_count,
        "session_complete": session_complete,
    }


def reveal(session_id: str, user_guess: str) -> Dict[str, Any]:
    session = db.get_session(session_id)
    if not session:
        raise ValueError(f"Session {session_id} not found")

    actual_mode = session["mode"]
    guess_correct = user_guess == actual_mode
    red_flags = session.get("red_flags_used", [])

    seen = set()
    unique_flags = [f for f in red_flags if f["explanation"] not in seen and not seen.add(f["explanation"])]

    db.complete_session(session_id, user_guess, guess_correct)
    stats = db.get_user_stats(session["user_id"])

    return {
        "actual_mode": actual_mode,
        "guess_correct": guess_correct,
        "red_flags": unique_flags,
        "score_update": {
            "total_completed": stats["total_completed"],
            "accuracy": stats["accuracy"],
            "current_streak": stats["current_streak"],
            "scam_detection_rate": stats["scam_detection_rate"],
        },
    }
