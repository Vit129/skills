#!/usr/bin/env python3
"""PreToolUse hook: deny reading a project-local skill's SKILL.md
(<project-root>/_skills/**/SKILL.md or <project-root>/.claude/skills/**/SKILL.md)
until that project root has been explicitly trusted, AND re-scan its content
on every load even after trust is granted.

Project-local skills (routing.md's "Project-Local Skill vs Identically-Named
Global Skill") are markdown procedure files a project's own CLAUDE.md points
the agent at directly via Read -- unlike ~/.claude/skills/*, they are never
routed through the Skill tool, so nothing else in this workspace gates them.
A cloned/forked repo could vendor one to get an agent to silently follow
injected instructions. Mirrors Hermes Agent's `hermes skills trust <path>`
(PR #88566) -- same threat, same fix shape: gate at first-read, not at
write/execute time.

Trust is a persistent allowlist (agent-memory/.state/skill-trust.json,
maintained by scripts/trust-project-skill.sh), not per-session -- once a
project is trusted it stays trusted across sessions, same as Hermes's model.

Path-trust alone only checks *where* a skill came from, once. A trusted
repo can still be hijacked later (compromised dependency, account takeover)
and push a malicious SKILL.md update -- path-trust wouldn't catch that,
since it never re-inspects content after the first grant. Hermes's real
mechanism (agent/skill_utils.py) closes this by re-scanning skill *content*
via skills_guard.scan_skill_cached on every single load, failing closed on
a dangerous verdict or scanner crash. This hook does the same at a lighter
weight: reuse memory-write-scan.py's regex/invisible-unicode scan() instead
of an LLM scanner, cache verdicts by content hash so unchanged files aren't
rescanned every time.

Fail-open on any error in the outer hook mechanism itself (can't even tell
what was requested) -- a broken gate must never block a legitimate read.
But the content-rescan step below is deliberately fail-CLOSED: once we know
enough to act (trusted project, real file, scan ran or didn't), a scan
failure or a dangerous verdict denies rather than silently allowing.
"""
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

TRUST_FILE = Path.home() / ".claude" / "agent-memory" / ".state" / "skill-trust.json"
SCAN_CACHE_FILE = Path.home() / ".claude" / "agent-memory" / ".state" / "skill-content-scan-cache.json"
GLOBAL_SKILL_ROOTS = (
    str(Path.home() / ".claude" / "skills") + "/",
    str(Path.home() / ".claude" / "plugins") + "/",
)
LOCAL_SKILL_DIR_PATTERN = re.compile(r"^(.*?)/(?:_skills|\.claude/skills|\.agents/skills)/.*/SKILL\.md$")


def find_project_root(file_path: str) -> str | None:
    if any(file_path.startswith(root) for root in GLOBAL_SKILL_ROOTS):
        return None
    m = LOCAL_SKILL_DIR_PATTERN.match(file_path)
    return m.group(1) if m else None


def is_trusted(project_root: str) -> bool:
    if not TRUST_FILE.exists():
        return False
    try:
        trusted = json.loads(TRUST_FILE.read_text())
    except (json.JSONDecodeError, OSError):
        return False
    return project_root in trusted


def _load_content_scanner():
    """Load memory-write-scan.py's scan() by path -- its filename has a
    hyphen, so a normal `import` statement can't reach it."""
    scan_path = Path(__file__).parent / "memory-write-scan.py"
    spec = importlib.util.spec_from_file_location("memory_write_scan", scan_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"could not load spec for {scan_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.scan


def _read_cache() -> dict:
    if not SCAN_CACHE_FILE.exists():
        return {}
    try:
        return json.loads(SCAN_CACHE_FILE.read_text())
    except (json.JSONDecodeError, OSError):
        return {}


def _write_cache(cache: dict) -> None:
    SCAN_CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    SCAN_CACHE_FILE.write_text(json.dumps(cache))


def content_scan_verdict(file_path: str) -> str | None:
    """Re-scan a trusted skill's content on every load. Returns None if
    clean, or a human-readable deny reason otherwise. Deliberately raises
    on any internal failure (unreadable file, broken scanner) instead of
    swallowing it -- the caller treats that as fail-closed, not fail-open.
    """
    content = Path(file_path).read_text()
    digest = hashlib.sha256(content.encode("utf-8", "surrogatepass")).hexdigest()

    cache = _read_cache()
    cached = cache.get(file_path)
    if cached and cached.get("hash") == digest:
        return cached.get("reason")  # None if previously clean

    scan = _load_content_scanner()
    reason = scan(content)

    cache[file_path] = {"hash": digest, "reason": reason}
    _write_cache(cache)
    return reason


def main() -> None:
    data = json.load(sys.stdin)
    if data.get("tool_name") != "Read":
        return

    file_path = data.get("tool_input", {}).get("file_path", "")
    project_root = find_project_root(file_path)
    if project_root is None:
        return

    if not is_trusted(project_root):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"project-skill-trust-gate: {project_root} has not been trusted as a "
                    "source of project-local skills yet. This is a repo-vendored skill file "
                    "(routing.md's project-local-skill convention), not a global "
                    "~/.claude/skills/ one -- ask the user via AskUserQuestion whether to "
                    f"trust this project, then run `bash ~/.claude/scripts/trust-project-skill.sh "
                    f"{project_root}` and retry the read. Do not trust silently."
                ),
            }
        }))
        return

    # Trusted project roots still get their skill content re-scanned on
    # every load -- trust is about origin, not a promise the content never
    # changed since. Fail closed: a scan error denies just like a dangerous
    # verdict does, unlike the outer hook-crash handler below.
    try:
        reason = content_scan_verdict(file_path)
    except Exception as exc:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"project-skill-trust-gate: content re-scan of a trusted skill "
                    f"({file_path}) failed ({exc!r}), so the read is denied rather than "
                    "silently allowed. Fix the scanner or investigate the file, then retry."
                ),
            }
        }))
        return

    if reason:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"project-skill-trust-gate: {project_root} is a trusted source, but this "
                    f"skill's current content looks dangerous ({reason}) and may have changed "
                    "since trust was granted (compromised dependency, hijacked repo, etc). "
                    "Review the file by hand before trusting it again -- this is not something "
                    "to silently bypass."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
