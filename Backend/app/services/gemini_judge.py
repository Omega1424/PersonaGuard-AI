"""
Gemini-powered LLM judge for post-reveal conversation analysis.
Evaluates: ground-truth judgment, reasoning quality, red-flag extraction,
pedagogical feedback, and difficulty estimation.
"""
import json
import logging
from typing import List, Dict, Any, Optional

from google import genai

from app.config import settings

logger = logging.getLogger(__name__)

JUDGE_MODEL = "gemini-2.0-flash"

_JUDGE_PROMPT = """You are an expert scam-awareness educator analysing a completed conversation simulation from PersonaGuard AI — a tool that trains people to detect scams.

CONVERSATION TRANSCRIPT:
{transcript}

GROUND TRUTH: This was a {actual_mode} conversation.
USER'S GUESS: The user guessed "{user_guess}".
RESULT: The user was {correct_or_incorrect}.

Analyse the conversation and return ONLY a JSON object with these exact fields (no markdown, no text outside the JSON):

{{
  "ground_truth_judgment": "{actual_mode}",
  "judgment_reasoning": "1-2 sentences explaining what in the dialogue confirms this was {actual_mode}.",
  "reasoning_quality": "strong or weak or lucky or incorrect",
  "reasoning_explanation": "2-3 sentences on why the user's guess quality was strong/weak/lucky/incorrect. Consider whether their answer was right for the right reasons.",
  "red_flags": [
    {{
      "phrase": "exact short quote or tight paraphrase from the persona's messages",
      "type": "urgency or impersonation or money_request or emotional_manipulation or secrecy or unrealistic_offer or information_harvesting",
      "explanation": "1-2 sentences on why this phrase is a manipulation tactic."
    }}
  ],
  "pedagogical_feedback": "2-4 sentences of plain-language educational feedback. Tell the user what to watch for next time and reinforce what they got right or wrong.",
  "difficulty_score": 5,
  "difficulty_explanation": "1 sentence: why was this conversation easy (1) or hard (10) to identify?"
}}

Rules:
- reasoning_quality: "strong" = correct guess AND clear red flags present; "weak" = correct but very subtle signals; "lucky" = correct but major obvious signals were missed; "incorrect" = wrong guess.
- red_flags: only populate for SCAM conversations — extract 3 to 6 specific tactics. For LEGIT conversations return an empty array [].
- difficulty_score must be an integer from 1 to 10. Replace the placeholder 5 with the actual score.
- Keep all text concise and educational — this is shown directly to learners."""


def judge_conversation(
    messages: List[Dict[str, Any]],
    actual_mode: str,
    user_guess: str,
) -> Optional[Dict[str, Any]]:
    """
    Send the full conversation to Gemini for pedagogical analysis.
    Returns a structured dict or None if the call fails / key is missing.
    """
    if not settings.gemini_api_key:
        logger.warning("GEMINI_API_KEY not configured — skipping LLM judge")
        return None

    try:
        client = genai.Client(api_key=settings.gemini_api_key)

        # Build plain-text transcript
        lines = []
        for msg in messages:
            role = "Persona" if msg["role"] == "assistant" else "User"
            lines.append(f"{role}: {msg['content']}")
        transcript = "\n".join(lines)

        correct_or_incorrect = "CORRECT" if user_guess == actual_mode else "INCORRECT"

        prompt = _JUDGE_PROMPT.format(
            transcript=transcript,
            actual_mode=actual_mode,
            user_guess=user_guess,
            correct_or_incorrect=correct_or_incorrect,
        )

        response = client.models.generate_content(
            model=JUDGE_MODEL,
            contents=prompt,
        )
        raw = response.text.strip()

        # Strip markdown code fences if Gemini wraps the JSON
        if raw.startswith("```"):
            parts = raw.split("```")
            raw = parts[1] if len(parts) > 1 else raw
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        return json.loads(raw)

    except Exception as exc:
        logger.error(f"Gemini judge failed: {exc}")
        return None
