"""
SQLite database setup and CRUD for PersonaGuard AI.
DB file: personaguard.db (same directory as backend root).
"""
import sqlite3
import json
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

DB_PATH = Path(__file__).parent.parent / "personaguard.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create tables if they don't exist. Runs migrations for existing DBs."""
    with get_conn() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                user_id         TEXT PRIMARY KEY,
                username        TEXT UNIQUE,
                password_hash   TEXT,
                module_completed BOOLEAN DEFAULT FALSE,
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions (
                session_id          TEXT PRIMARY KEY,
                user_id             TEXT NOT NULL,
                persona             TEXT NOT NULL,
                mode                TEXT NOT NULL,
                awareness_answered  TEXT NOT NULL,
                user_guess          TEXT,
                guess_correct       BOOLEAN,
                red_flags_used      TEXT DEFAULT '[]',
                started_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at        TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS messages (
                message_id      INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id      TEXT NOT NULL,
                role            TEXT NOT NULL,
                content         TEXT NOT NULL,
                message_index   INTEGER NOT NULL,
                timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(session_id)
            );
        """)
        # Migration: add auth columns to existing DBs (silently skip if already present)
        for stmt in [
            "ALTER TABLE users ADD COLUMN username TEXT",
            "ALTER TABLE users ADD COLUMN password_hash TEXT",
        ]:
            try:
                conn.execute(stmt)
            except Exception:
                pass
        conn.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)"
        )
    logger.info(f"Database initialised at {DB_PATH}")


# ─── Users ────────────────────────────────────────────────────────────────────

def create_user(username: str, password_hash: str) -> Dict[str, Any]:
    """Create a new user with credentials. Returns the created user record."""
    user_id = str(uuid.uuid4())
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash) VALUES (?, ?, ?)",
            (user_id, username, password_hash),
        )
    return get_user(user_id)


def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT user_id, username, password_hash, module_completed, created_at FROM users WHERE username = ?",
            (username,),
        ).fetchone()
    return dict(row) if row else None


def upsert_user(user_id: str) -> Dict[str, Any]:
    """Create user if not exists; return user record."""
    with get_conn() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO users (user_id) VALUES (?)",
            (user_id,)
        )
        row = conn.execute(
            "SELECT user_id, module_completed, created_at FROM users WHERE user_id = ?",
            (user_id,)
        ).fetchone()
    return dict(row)


def mark_module_complete(user_id: str):
    with get_conn() as conn:
        conn.execute(
            "UPDATE users SET module_completed = TRUE WHERE user_id = ?",
            (user_id,)
        )


def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT user_id, module_completed, created_at FROM users WHERE user_id = ?",
            (user_id,)
        ).fetchone()
    return dict(row) if row else None


# ─── Sessions ─────────────────────────────────────────────────────────────────

def create_session(user_id: str, persona: str, mode: str, awareness_answered: str) -> str:
    session_id = str(uuid.uuid4())
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO sessions
               (session_id, user_id, persona, mode, awareness_answered)
               VALUES (?, ?, ?, ?, ?)""",
            (session_id, user_id, persona, mode, awareness_answered)
        )
    return session_id


def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM sessions WHERE session_id = ?",
            (session_id,)
        ).fetchone()
    if not row:
        return None
    d = dict(row)
    d["red_flags_used"] = json.loads(d.get("red_flags_used") or "[]")
    return d


def complete_session(session_id: str, user_guess: str, guess_correct: bool):
    with get_conn() as conn:
        conn.execute(
            """UPDATE sessions
               SET user_guess = ?, guess_correct = ?, completed_at = ?
               WHERE session_id = ?""",
            (user_guess, guess_correct, datetime.now(timezone.utc).isoformat(), session_id)
        )


def append_red_flag(session_id: str, flag: Dict[str, Any]):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT red_flags_used FROM sessions WHERE session_id = ?",
            (session_id,)
        ).fetchone()
        if not row:
            return
        flags = json.loads(row["red_flags_used"] or "[]")
        flags.append(flag)
        conn.execute(
            "UPDATE sessions SET red_flags_used = ? WHERE session_id = ?",
            (json.dumps(flags), session_id)
        )


# ─── Messages ─────────────────────────────────────────────────────────────────

def add_message(session_id: str, role: str, content: str, message_index: int):
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO messages (session_id, role, content, message_index)
               VALUES (?, ?, ?, ?)""",
            (session_id, role, content, message_index)
        )


def get_session_messages(session_id: str) -> List[Dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT role, content, message_index
               FROM messages
               WHERE session_id = ?
               ORDER BY message_index ASC""",
            (session_id,)
        ).fetchall()
    return [dict(r) for r in rows]


def count_user_messages(session_id: str) -> int:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT COUNT(*) as cnt FROM messages WHERE session_id = ? AND role = 'user'",
            (session_id,)
        ).fetchone()
    return row["cnt"] if row else 0


# ─── Stats ────────────────────────────────────────────────────────────────────

def get_user_stats(user_id: str) -> Dict[str, Any]:
    with get_conn() as conn:
        sessions = conn.execute(
            """SELECT session_id, persona, mode, awareness_answered,
                      user_guess, guess_correct, started_at, completed_at
               FROM sessions
               WHERE user_id = ? AND completed_at IS NOT NULL
               ORDER BY completed_at DESC""",
            (user_id,)
        ).fetchall()

    rows = [dict(s) for s in sessions]
    total = len(rows)

    if total == 0:
        return {
            "total_completed": 0,
            "accuracy": None,
            "accuracy_by_persona": {"ahbeng": None, "xmm": None, "spf": None},
            "pre_module_accuracy": None,
            "post_module_accuracy": None,
            "current_streak": 0,
            "best_streak": 0,
            "scam_detection_rate": None,
            "false_positive_rate": None,
            "sessions": rows,
        }

    correct = sum(1 for r in rows if r["guess_correct"])
    accuracy = round(correct / total * 100, 1) if total else None

    # Per-persona accuracy
    personas = ["ahbeng", "xmm", "spf"]
    acc_by_persona = {}
    for p in personas:
        p_rows = [r for r in rows if r["persona"] == p]
        if p_rows:
            acc_by_persona[p] = round(sum(1 for r in p_rows if r["guess_correct"]) / len(p_rows) * 100, 1)
        else:
            acc_by_persona[p] = None

    # Pre/post module accuracy (based on awareness_answered yes/no)
    pre = [r for r in rows if r["awareness_answered"] == "no"]
    post = [r for r in rows if r["awareness_answered"] == "yes"]
    pre_acc = round(sum(1 for r in pre if r["guess_correct"]) / len(pre) * 100, 1) if pre else None
    post_acc = round(sum(1 for r in post if r["guess_correct"]) / len(post) * 100, 1) if post else None

    # Streaks (ordered by time, most recent first)
    streak_rows = list(reversed(rows))  # oldest first for streak calc
    current_streak = 0
    best_streak = 0
    run = 0
    for r in streak_rows:
        if r["guess_correct"]:
            run += 1
            best_streak = max(best_streak, run)
        else:
            run = 0
    # Current streak: count from end
    current_streak = 0
    for r in reversed(streak_rows):
        if r["guess_correct"]:
            current_streak += 1
        else:
            break

    # Scam detection rate: accuracy on scam-mode sessions
    scam_sessions = [r for r in rows if r["mode"] == "scam"]
    scam_rate = round(sum(1 for r in scam_sessions if r["guess_correct"]) / len(scam_sessions) * 100, 1) if scam_sessions else None

    # False positive rate: how often user called legit a scam
    legit_sessions = [r for r in rows if r["mode"] == "legit"]
    fp_rate = round(sum(1 for r in legit_sessions if r["user_guess"] == "scam") / len(legit_sessions) * 100, 1) if legit_sessions else None

    return {
        "total_completed": total,
        "accuracy": accuracy,
        "accuracy_by_persona": acc_by_persona,
        "pre_module_accuracy": pre_acc,
        "post_module_accuracy": post_acc,
        "current_streak": current_streak,
        "best_streak": best_streak,
        "scam_detection_rate": scam_rate,
        "false_positive_rate": fp_rate,
        "sessions": rows,
    }
