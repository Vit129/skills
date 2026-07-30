#!/usr/bin/env python3
"""UserPromptSubmit hook: merged entry point for all matcher-"*" checks.

Combines what were two separate processes (skill-trigger.py,
memory-passive-review.py) into one, since both ran on every prompt
under the same matcher — one python3 spawn instead of two per turn.
Each check keeps its own function/failure boundary so either can be
edited independently; only the process and stdin/stdout plumbing is
shared. Fail-open per check: one broken check must not suppress the
other or block the prompt.
"""
import datetime
import json
import re
import sys
from pathlib import Path

HOOKS_DIR = Path(__file__).resolve().parent
STATE_PATH = Path.home() / ".claude" / "agent-memory" / ".state" / "memory-passive-review-state.json"
NUDGES_LOG = Path.home() / ".claude" / "agent-memory" / "routing-nudges.log"
COOLDOWN_TURNS = 3

CORRECTION_PATTERNS = [
    r"\bstop doing\b",
    r"\bdon'?t do that\b",
    r"\bno,? not that\b",
    r"\bthat'?s wrong\b",
    r"\bthat'?s not right\b",
    r"\bnever do that again\b",
    r"\bthat broke\b",
    r"\brevert that\b",
    r"\bundo that\b",
    r"\bnot what i asked\b",
]
CONFIRMATION_PATTERNS = [
    r"\bexactly right\b",
    r"\byes,? exactly\b",
    r"\bperfect,? keep\b",
    r"\bthat worked\b",
    r"\bkeep doing that\b",
    r"\bgood call\b",
    r"\bnailed it\b",
    r"\bcorrect approach\b",
]
MEMORY_PATTERNS = [re.compile(p, re.IGNORECASE) for p in CORRECTION_PATTERNS + CONFIRMATION_PATTERNS]

MEMORY_NUDGE = (
    "Passive memory review: this message reads like feedback (a correction or "
    "confirmation of approach). If it teaches a durable, non-project-specific "
    "lesson, save it now as a feedback memory (see CLAUDE.md Memory Protocol) "
    "instead of deferring to session-end memory-curator."
)


def check_skill_trigger(prompt, session_id):
    """Soft nudge only -- this does not block, and a match is not proof of a
    routing miss (a keyword can land inside quoted/reported text that isn't
    the user's actual ask). Every fire is logged to routing-nudges.log so
    scripts/routing-adherence-scheduler.sh can later check whether the
    suggested skill actually got invoked in this session -- previously the
    nudge fired and vanished with no record either way."""
    try:
        rules = json.loads((HOOKS_DIR / "skill-keywords.json").read_text())
        low = prompt.lower()
        for rule in rules:
            for kw in rule["keywords"]:
                if re.search(r"\b" + re.escape(kw.lower()) + r"\b", low):
                    try:
                        NUDGES_LOG.parent.mkdir(parents=True, exist_ok=True)
                        with NUDGES_LOG.open("a") as f:
                            f.write(
                                f"{datetime.date.today().isoformat()}|{session_id}|"
                                f"{kw}|{rule['skill']}\n"
                            )
                    except Exception:
                        pass
                    return (
                        f"Skill-trigger keyword detected: {kw} -> invoke "
                        f"Skill({rule['skill']}) before responding, per rules/routing.md."
                    )
    except Exception:
        pass
    return None


def check_memory_passive_review(prompt, session_id):
    try:
        try:
            state = json.loads(STATE_PATH.read_text())
        except Exception:
            state = {}

        session_state = state.get(session_id, {"count": 0, "last_fired": -COOLDOWN_TURNS})
        session_state["count"] += 1

        matched = any(p.search(prompt) for p in MEMORY_PATTERNS)
        should_fire = matched and (session_state["count"] - session_state["last_fired"] >= COOLDOWN_TURNS)
        if should_fire:
            session_state["last_fired"] = session_state["count"]

        state[session_id] = session_state
        STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
        STATE_PATH.write_text(json.dumps(state))

        if should_fire:
            return MEMORY_NUDGE
    except Exception:
        pass
    return None


def main():
    data = json.load(sys.stdin)
    prompt = data.get("prompt", "")
    session_id = data.get("session_id", "unknown")

    messages = [
        m for m in (
            check_skill_trigger(prompt, session_id),
            check_memory_passive_review(prompt, session_id),
        ) if m
    ]

    if messages:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "UserPromptSubmit",
                "additionalContext": "\n".join(messages),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
