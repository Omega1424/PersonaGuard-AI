"""
HuggingFace-based session-aware chat service for PersonaGuard AI.
Chat: gradio_client calling persona HF Spaces with ChatML prompt injection.
Red flags: HF Inference API classifier at reveal time (scam sessions only).
"""
import json
import ast
import logging
import re
import requests
from typing import List, Dict, Any, Tuple

from gradio_client import Client

from app import db
from app.config import settings

logger = logging.getLogger(__name__)

MAX_USER_MESSAGES = 10

OPEN_TRIGGER = "Start the conversation now. Send your opening message as your character. Keep it brief and natural."

# HF Spaces per persona — swap these out once Priyanshi deploys her Spaces
HF_SPACES: Dict[str, str] = {
    "ahbeng": "priyanshis9876/ahbeng_singlish_persona",
    "xmm":    "priyanshis9876/xmm_singlish_persona",
    "spf":    "priyanshis9876/spf_singlish_persona",
}

# Classifier for red flag detection at reveal time
HF_CLASSIFIER = "priyanshis9876/singlish_scam_classifier"
CLASSIFIER_THRESHOLD = 0.6

# System prompts imported lazily to avoid circular issues
def _get_system_prompt(persona: str, mode: str) -> str:
    from app.services.prompts import SYSTEM_PROMPTS
    return SYSTEM_PROMPTS[persona][mode]


# ─── Prompt building ──────────────────────────────────────────────────────────

def _build_prompt(system_prompt: str, stored_history: List[Dict[str, Any]], current_user_msg: str) -> str:
    """
    Build a full ChatML-formatted prompt string.
    stored_history: all DB messages up to (but NOT including) the current user message.
    OPEN_TRIGGER is prepended as the first user turn to prime the model.
    """
    lines = []
    lines.append(f"<|im_start|>system\n{system_prompt}\n<|im_end|>")
    lines.append(f"<|im_start|>user\n{OPEN_TRIGGER}\n<|im_end|>")

    for msg in stored_history:
        role = "assistant" if msg["role"] == "assistant" else "user"
        lines.append(f"<|im_start|>{role}\n{msg['content']}\n<|im_end|>")

    lines.append(f"<|im_start|>user\n{current_user_msg}\n<|im_end|>")
    lines.append("<|im_start|>assistant\n")

    return "\n".join(lines)


# ─── HF Space inference ───────────────────────────────────────────────────────

def _parse_hf_result(result: Any) -> str:
    """Extract text response from HF Space result (JSON string or raw text)."""
    try:
        parsed = json.loads(result)
        return str(parsed.get("response", result)).strip()
    except (json.JSONDecodeError, TypeError):
        try:
            parsed = ast.literal_eval(result)
            return str(parsed.get("response", result)).strip()
        except Exception:
            return str(result).strip()


def _call_hf(persona: str, prompt: str) -> str:
    """Call the HF Space for the given persona and return the response text."""
    space = HF_SPACES[persona]
    try:
        client = Client(space)
        result = client.predict(prompt, api_name="/inference")
        return _parse_hf_result(result)
    except Exception as e:
        err = str(e)
        if "GPU quota" in err:
            wait = re.search(r'Try again in ([\d:]+)', err)
            wait_str = wait.group(1) if wait else "a few minutes"
            raise RuntimeError(f"GPU quota exceeded — try again in {wait_str}")
        logger.error(f"HF inference error [{space}]: {err}")
        raise


# ─── Classifier (reveal time only) ───────────────────────────────────────────

def _classify_scam_messages(messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Run the HF Inference API scam classifier on each assistant message.
    Returns red_flags list: [{phrase, message_index, explanation}]
    for messages that score above CLASSIFIER_THRESHOLD as scam.
    """
    headers = {"Content-Type": "application/json"}
    if settings.hf_token:
        headers["Authorization"] = f"Bearer {settings.hf_token}"

    flags = []
    for msg in messages:
        if msg["role"] != "assistant":
            continue
        text = msg["content"].strip()
        if not text:
            continue

        try:
            r = requests.post(
                f"https://api-inference.huggingface.co/models/{HF_CLASSIFIER}",
                headers=headers,
                json={"inputs": text},
                timeout=20,
            )
            r.raise_for_status()
            result = r.json()

            # Handle [[{label, score}]] or [{label, score}]
            if isinstance(result, list) and result:
                preds = result[0] if isinstance(result[0], list) else result
            else:
                continue

            # Find the scam label (ignore "not_scam", "legit", "safe" variants)
            scam_score = None
            for pred in preds:
                label = pred.get("label", "").upper()
                if "SCAM" in label and "NOT" not in label:
                    scam_score = pred.get("score", 0)
                    break

            if scam_score is not None and scam_score >= CLASSIFIER_THRESHOLD:
                pct = round(scam_score * 100)
                flags.append({
                    "phrase": text,
                    "message_index": msg["message_index"],
                    "explanation": f"AI classifier flagged this message as scam ({pct}% confidence) — it contains language typical of manipulation tactics.",
                })

        except Exception as e:
            logger.warning(f"Classifier failed on message_index={msg.get('message_index')}: {e}")
            continue

    return flags


# ─── Public API ───────────────────────────────────────────────────────────────

def start_session(
    user_id: str,
    persona: str,
    mode: str,
    awareness_answered: str,
) -> Tuple[str, str]:
    session_id = db.create_session(user_id, persona, mode, awareness_answered)
    system_prompt = _get_system_prompt(persona, mode)

    # Opening prompt — no prior history, prime model to generate opening line
    prompt = (
        f"<|im_start|>system\n{system_prompt}\n<|im_end|>\n"
        f"<|im_start|>user\n{OPEN_TRIGGER}\n<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )
    first_message = _call_hf(persona, prompt)

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
    system_prompt = _get_system_prompt(persona, mode)

    stored = db.get_session_messages(session_id)
    next_index = len(stored) + 1

    db.add_message(session_id, "user", user_message, message_index=next_index)
    next_index += 1

    user_msg_count = db.count_user_messages(session_id)

    # History = everything stored except the user message we just added
    history_without_last = db.get_session_messages(session_id)[:-1]
    prompt = _build_prompt(system_prompt, history_without_last, user_message)

    assistant_text = _call_hf(persona, prompt)
    db.add_message(session_id, "assistant", assistant_text, message_index=next_index)

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

    all_messages = db.get_session_messages(session_id)

    # Run classifier on all assistant messages (scam sessions only)
    if actual_mode == "scam":
        red_flags = _classify_scam_messages(all_messages)
    else:
        red_flags = []

    # Gemini LLM judge — runs for both scam and legit sessions
    from app.services.gemini_judge import judge_conversation
    judge = judge_conversation(all_messages, actual_mode, user_guess)

    db.complete_session(session_id, user_guess, guess_correct)
    stats = db.get_user_stats(session["user_id"])

    return {
        "actual_mode": actual_mode,
        "guess_correct": guess_correct,
        "red_flags": red_flags,
        "score_update": {
            "total_completed": stats["total_completed"],
            "accuracy": stats["accuracy"],
            "current_streak": stats["current_streak"],
            "scam_detection_rate": stats["scam_detection_rate"],
        },
        "judge": judge,
    }
