#!/usr/bin/env python3
"""PostToolUse hook (matcher: Workflow).

Logs every Workflow tool invocation into the SAME file as Skill invocations,
agent-memory/skill-usage.log (merged 2026-07-30 -- skill and workflow are
both "something got invoked" events and splitting them across two files made
cross-referencing harder for no real benefit). Line format
`date|session_id|workflow:name`, vs a skill's `date|session_id|skill_name` --
the `workflow:` prefix is the disambiguator, not a separate column, so every
existing consumer of skill-usage.log keeps working unchanged:
memory-decay-scheduler.sh's dormancy grep (`|${name}$`) and
routing-adherence-scheduler.sh's adherence grep (`|${nsession}|${nskill}$`)
both only ever look for a bare skill name at the end of the line -- a
`workflow:foo` entry can't match `|foo$` because the character right before
"foo" is `:`, not `|`. This hook did not exist before 2026-07-29 -- Workflow
tool calls were never logged (verified via git log: no "Workflow" matcher
ever existed in scripts/settings-hooks.template.json, no rule ever named it).

Identifier resolution, in priority order:
1. tool_input.name -- a saved/predefined workflow invoked by name
2. `name:` field parsed out of tool_input.script's `export const meta = {...}`
   -- an inline script; meta.name is required by the Workflow tool contract
3. basename of tool_input.scriptPath -- a resumed/edited script file
4. "unknown"
"""
import json
import re
import sys
import datetime
from pathlib import Path

USAGE_LOG = Path.home() / ".claude" / "agent-memory" / "skill-usage.log"


def resolve_name(tool_input):
    name = tool_input.get("name")
    if name:
        return name

    script = tool_input.get("script") or ""
    match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", script)
    if match:
        return match.group(1)

    script_path = tool_input.get("scriptPath")
    if script_path:
        return Path(script_path).stem

    return "unknown"


def main():
    data = json.load(sys.stdin)
    tool_input = data.get("tool_input", {}) or {}
    name = resolve_name(tool_input)
    session_id = data.get("session_id", "") or "unknown"

    USAGE_LOG.parent.mkdir(parents=True, exist_ok=True)
    with USAGE_LOG.open("a") as f:
        f.write(f"{datetime.date.today().isoformat()}|{session_id}|workflow:{name}\n")

    print(f"[Workflow invoked: {name}]", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
