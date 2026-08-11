#!/usr/bin/env python3
"""PreToolUse hook: scan Write/Edit content going into memory files (agent-memory/,
skills/candidates/, projects/*/memory/) for prompt-injection markers before it lands.
Memory files get auto-injected into every future session's context, so an unscanned
bad entry is a standing injection vector. Fail-open on any error.

ponytail: regex/codepoint heuristic scan, not semantic — catches known injection
phrasing and invisible-unicode tricks, not a novel obfuscation. Upgrade path: route
flagged-but-uncertain content through an LLM classifier instead of hard-deny.
"""
import json
import re
import sys
from pathlib import Path

MEMORY_PATH_MARKERS = ("/agent-memory/", "/skills/candidates/", "/memory/")

INVISIBLE_CODEPOINTS = {
    "​", "‌", "‍", "﻿",  # zero-width space/joiners/BOM
    "‪", "‫", "‬", "‭", "‮",  # bidi overrides
    "⁦", "⁧", "⁨", "⁩",  # bidi isolates
}

INJECTION_PATTERNS = [
    re.compile(r"ignore (all )?(previous|prior|above) instructions", re.I),
    re.compile(r"disregard (all )?(previous|prior|above)", re.I),
    re.compile(r"you are now (in )?(developer|debug|admin|jailbreak)", re.I),
    re.compile(r"reveal (your|the) (system prompt|instructions)", re.I),
    re.compile(r"do not tell (the )?user", re.I),
    re.compile(r"<\s*system\s*>", re.I),
    # Credential/SSH-key exfiltration — match the *exfiltrate* shape (an
    # instruction to send a secret somewhere), not bare secret vocabulary.
    # This workspace's own memories discuss .env/API keys/credentials
    # constantly as ordinary content; a word-presence pattern would deny
    # legitimate writes. See the false-positive self-test below.
    re.compile(
        r"(send|post|upload|exfiltrate|email)\s+(your|my|the)?\s*"
        r"(ssh key|private key|id_rsa|api[_ ]?key|access token|credentials?|password)s?\s+to\s+\S",
        re.I,
    ),
    re.compile(
        r"\bcat\b.{0,30}(id_rsa|\.ssh/|\.aws/credentials|\.env\b).{0,40}\|\s*(curl|nc|wget|ssh)\b",
        re.I,
    ),
]


def is_memory_path(path: str) -> bool:
    return any(marker in path for marker in MEMORY_PATH_MARKERS) and path.endswith(".md")


def scan(text: str) -> str | None:
    found_invisible = sorted({f"U+{ord(c):04X}" for c in text if c in INVISIBLE_CODEPOINTS})
    if found_invisible:
        return f"invisible unicode codepoint(s) found: {', '.join(found_invisible)}"
    for pattern in INJECTION_PATTERNS:
        m = pattern.search(text)
        if m:
            return f"injection-like phrase matched: \"{m.group(0)}\""
    return None


def main() -> None:
    data = json.load(sys.stdin)
    if data.get("tool_name") not in ("Edit", "Write"):
        return

    tool_input = data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")
    if not is_memory_path(file_path):
        return

    content = tool_input.get("content") or tool_input.get("new_string") or ""
    if not content:
        return

    reason = scan(content)
    if reason:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"memory-write-scan: blocked write to {Path(file_path).name} — {reason}. "
                    "Memory files auto-load into every future session; review the content "
                    "before writing. If this is a false positive, rephrase to avoid the pattern."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
