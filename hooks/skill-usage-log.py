#!/usr/bin/env python3
"""PostToolUse hook (matcher: Skill).

Logs every invocation to agent-memory/skill-usage.log (unchanged behavior,
previously an inline settings.json command). Also nudges toward SKILL-LOG.md:
if the same skill is invoked a 2nd time in one session, that's a decent
proxy for "the first attempt had friction" -- print a reminder once (per
skill per session) to log a proposal if that's actually what happened.

'interview' is excluded: routing.md has it fire on every new task by design,
so repeat use within a session is normal, not a friction signal.
"""
import json
import sys
import datetime
from pathlib import Path

USAGE_LOG = Path.home() / ".claude" / "agent-memory" / "skill-usage.log"
STATE_DIR = Path.home() / ".claude" / ".state" / "skill-session-counts"
NO_NUDGE = {"interview"}


def main():
    data = json.load(sys.stdin)
    skill = data.get("tool_input", {}).get("skill", "") or "unknown"
    session_id = data.get("session_id", "") or "unknown"

    if skill != "unknown":
        with USAGE_LOG.open("a") as f:
            f.write(f"{datetime.date.today().isoformat()}|{skill}\n")

    print(f"[Skill invoked: {skill}]", flush=True)

    if skill == "unknown" or session_id == "unknown" or skill in NO_NUDGE:
        return

    STATE_DIR.mkdir(parents=True, exist_ok=True)
    cutoff = datetime.datetime.now().timestamp() - 2 * 86400
    for f in STATE_DIR.glob("*.json"):
        try:
            if f.stat().st_mtime < cutoff:
                f.unlink()
        except OSError:
            pass

    state_file = STATE_DIR / f"{session_id}.json"
    try:
        counts = json.loads(state_file.read_text()) if state_file.exists() else {}
    except Exception:
        counts = {}
    counts[skill] = counts.get(skill, 0) + 1
    state_file.write_text(json.dumps(counts))

    if counts[skill] == 2:
        print(
            f"[skill-log-nudge] '{skill}' invoked a 2nd time this session -- if the "
            f"first attempt had friction, was wrong, or needed correcting, append a "
            f"row to agent-memory/SKILL-LOG.md (max 1 proposal per skill per session) "
            f"before moving on. Routine re-invocation with no issue: ignore this.",
            flush=True,
        )


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
