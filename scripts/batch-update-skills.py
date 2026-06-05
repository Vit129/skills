#!/usr/bin/env python3
"""Batch update SKILL.md files with improvement tracking infrastructure."""
import os
import re
import glob

SKILLS_ROOT = os.path.expanduser("~/.kiro/skills")
TODAY = "2026-05-31"

IMPROVEMENT_TRACKING = """
### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`"""

AIDLC_GATE = """
## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC
"""

CONSISTENCY_CONTRACT = """
## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.
"""

# Domains that get AIDLC Gate + Consistency Contract
ENFORCED_DOMAINS = {"dev", "qa", "governance"}


def get_domain(filepath):
    """Extract domain from path like .../skills/dev/backend-dev/SKILL.md"""
    rel = os.path.relpath(filepath, SKILLS_ROOT)
    return rel.split(os.sep)[0]


def add_version_to_frontmatter(content):
    """Add version/last_improved/improvement_count after name: line in frontmatter."""
    if "version:" in content.split("---")[1] if content.startswith("---") else False:
        return content  # already has version

    # Find frontmatter boundaries
    parts = content.split("---", 2)
    if len(parts) < 3:
        return content  # no valid frontmatter

    frontmatter = parts[1]
    if "version:" not in frontmatter:
        # Insert version fields after name: line
        lines = frontmatter.split("\n")
        new_lines = []
        inserted = False
        for i, line in enumerate(lines):
            new_lines.append(line)
            # Insert after the name: field (which may be multi-line with description)
            if not inserted and line.startswith("name:"):
                # Check if next lines are continuation (indented or description:)
                # We'll insert after the description block ends
                pass
            # Insert before description if name is single-line, or after description ends
            if not inserted and (line.startswith("description:") or (i > 0 and lines[i-1].startswith("description:"))):
                # Find end of description (next non-indented, non-empty line or end)
                pass

        # Simpler approach: insert right after "name:" line (or after multi-line name)
        # Find the last line of the frontmatter content and insert before ---
        frontmatter_stripped = frontmatter.rstrip()
        version_block = f"\nversion: 1.0.0\nlast_improved: {TODAY}\nimprovement_count: 0"
        # Insert at end of frontmatter (before closing ---)
        new_frontmatter = frontmatter_stripped + version_block + "\n"
        content = "---" + new_frontmatter + "---" + parts[2]

    return content


def add_improvement_tracking(content):
    """Add Improvement Tracking subsection after Self-Learning section."""
    if "### Improvement Tracking" in content:
        return content  # already has it

    if "## Self-Learning" not in content:
        # No Self-Learning section — append at end
        content = content.rstrip() + "\n" + IMPROVEMENT_TRACKING + "\n"
    else:
        # Append at end of file (Self-Learning is always last)
        content = content.rstrip() + "\n" + IMPROVEMENT_TRACKING + "\n"

    return content


def add_aidlc_gate(content):
    """Add AIDLC Gate section after the first # heading."""
    if "## AIDLC Gate" in content:
        return content  # already has it

    # Find the first # heading (not ##) after frontmatter
    # Insert AIDLC Gate after the first line that starts with "# " (title)
    lines = content.split("\n")
    new_lines = []
    inserted = False
    in_frontmatter = False
    frontmatter_count = 0

    for line in lines:
        if line.strip() == "---":
            frontmatter_count += 1
        new_lines.append(line)
        # After frontmatter ends and we hit the first # heading
        if not inserted and frontmatter_count >= 2 and line.startswith("# ") and not line.startswith("## "):
            new_lines.append(AIDLC_GATE)
            inserted = True

    if not inserted:
        # Fallback: insert after frontmatter
        content = content.rstrip() + "\n" + AIDLC_GATE + "\n"
    else:
        content = "\n".join(new_lines)

    return content


def add_consistency_contract(content):
    """Add Consistency Contract before Verification section."""
    if "## Consistency Contract" in content:
        return content  # already has it

    if "## Verification" in content:
        content = content.replace("## Verification", CONSISTENCY_CONTRACT + "\n## Verification")
    else:
        # No Verification section — insert before Required Context or at end
        if "## Required Context" in content:
            content = content.replace("## Required Context", CONSISTENCY_CONTRACT + "\n## Required Context")
        else:
            content = content.rstrip() + "\n" + CONSISTENCY_CONTRACT + "\n"

    return content


def process_file(filepath):
    """Process a single SKILL.md file."""
    with open(filepath, "r") as f:
        content = f.read()

    domain = get_domain(filepath)
    skill_name = os.path.basename(os.path.dirname(filepath))

    # Phase 1: ALL skills
    content = add_version_to_frontmatter(content)
    content = add_improvement_tracking(content)

    # Phase 2: dev/qa/governance only
    if domain in ENFORCED_DOMAINS:
        content = add_aidlc_gate(content)
        content = add_consistency_contract(content)

    with open(filepath, "w") as f:
        f.write(content)

    extras = " + AIDLC gate + consistency" if domain in ENFORCED_DOMAINS else ""
    print(f"  ✅ {domain}/{skill_name} (version + tracking{extras})")


def main():
    files = sorted(glob.glob(os.path.join(SKILLS_ROOT, "*", "*", "SKILL.md")))
    print(f"=== Updating {len(files)} SKILL.md files ===\n")

    for f in files:
        process_file(f)

    print(f"\n=== Done ===")
    print(f"Total: {len(files)}")
    enforced = [f for f in files if get_domain(f) in ENFORCED_DOMAINS]
    print(f"With AIDLC Gate + Consistency: {len(enforced)} (dev/qa/governance)")
    print(f"Version + Tracking only: {len(files) - len(enforced)} (others)")


if __name__ == "__main__":
    main()
