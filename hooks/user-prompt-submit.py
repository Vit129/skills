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

# "project"-type memory only ever gets written via explicit correction/
# confirmation phrases (the check above) or session-end/manual memory-curator
# — neither fires on "did substantial work happen." A 2026-08-11 session
# built 5 real features over ~2 hours with zero memory capture until the
# user asked directly whether the newest work would show up in the journey
# timeline, and it didn't. This closes that gap: count Write/Edit calls to
# non-memory paths since the last memory write in THIS session's own
# transcript: cross MEMORY_WORK_THRESHOLD un-captured edits -> nudge.
#
# Markers deliberately match scripts/journey_timeline.py's exact 3 source
# roots (Claude Code memory, agent-memory/knowledge, skills/candidates) --
# NOT memory-write-scan.py's broader "/agent-memory/" marker, which also
# covers plans/, digest/, .state/ etc. A live check against this session's
# own transcript caught the bug: with the broader marker, an ordinary
# dev-task-progress.md edit falsely counted as "closing the loop" even
# though journey_timeline.py never reads that file.
#
# The Claude Code memory marker used to be hardcoded to this one project's
# own memory dir (/projects/-Users-supavit-cho--claude/memory/), so a memory
# write made while working in any OTHER project (Home-Assistant, wiremock,
# etc.) was invisible to this check -- 2026-08-16, found via journey_timeline.py
# showing zero new nodes since 2026-08-12 despite real memory writes landing
# in other projects' memory dirs the whole time. journey_timeline.py had the
# same bug, fixed there first (scans all projects/*/memory/ now).
PROJECT_MEMORY_RE = re.compile(r"/projects/[^/]+/memory/")
MEMORY_PATH_MARKERS = (
    "/agent-memory/knowledge/",
    "/skills/candidates/",
)


def is_memory_path(file_path: str) -> bool:
    return bool(PROJECT_MEMORY_RE.search(file_path)) or any(
        marker in file_path for marker in MEMORY_PATH_MARKERS
    )
MEMORY_WORK_THRESHOLD = 6
MEMORY_WORK_COOLDOWN_TURNS = 5

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


def count_uncaptured_work(transcript_path):
    """Walk this session's own transcript. Return the count of Write/Edit
    calls to non-memory paths since the most recent Write/Edit to a
    memory-path (agent-memory/, skills/candidates/, or a Claude Code
    projects/*/memory/*.md file) -- 0 if a memory write is the most recent
    matching call, or if there's no transcript yet."""
    if not transcript_path:
        return 0
    last_memory_idx = -1
    non_memory_calls = []
    idx = 0
    with open(transcript_path) as f:
        for line in f:
            try:
                obj = json.loads(line)
            except Exception:
                continue
            content = obj.get("message", {}).get("content")
            if not isinstance(content, list):
                continue
            for block in content:
                if not (isinstance(block, dict) and block.get("type") == "tool_use"):
                    continue
                if block.get("name") not in ("Write", "Edit"):
                    continue
                file_path = block.get("input", {}).get("file_path", "")
                if is_memory_path(file_path):
                    last_memory_idx = idx
                else:
                    non_memory_calls.append(idx)
                idx += 1
    return sum(1 for i in non_memory_calls if i > last_memory_idx)


def check_project_memory_nudge(session_id, transcript_path):
    try:
        try:
            state = json.loads(STATE_PATH.read_text())
        except Exception:
            state = {}

        key = f"{session_id}:work"
        session_state = state.get(key, {"count": 0, "last_fired": -MEMORY_WORK_COOLDOWN_TURNS})
        session_state["count"] += 1

        uncaptured = count_uncaptured_work(transcript_path)
        should_fire = (
            uncaptured >= MEMORY_WORK_THRESHOLD
            and session_state["count"] - session_state["last_fired"] >= MEMORY_WORK_COOLDOWN_TURNS
        )
        if should_fire:
            session_state["last_fired"] = session_state["count"]

        state[key] = session_state
        STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
        STATE_PATH.write_text(json.dumps(state))

        if should_fire:
            return (
                f"Passive memory review: {uncaptured} Write/Edit calls to non-memory "
                "files this session with no memory write since -- if durable, "
                "non-obvious decisions or facts came out of that work, capture a "
                "project/feedback memory now rather than waiting for session-end."
            )
    except Exception:
        pass
    return None


def main():
    data = json.load(sys.stdin)
    prompt = data.get("prompt", "")
    session_id = data.get("session_id", "unknown")
    transcript_path = data.get("transcript_path")

    messages = [
        m for m in (
            check_skill_trigger(prompt, session_id),
            check_memory_passive_review(prompt, session_id),
            check_project_memory_nudge(session_id, transcript_path),
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
