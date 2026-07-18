#!/usr/bin/env python3
"""PostToolUse hook: after Edit/Write on a known design-token file, remind
the agent to update the project's DESIGN.md in this same turn if the change
touched colors/fonts/spacing/components. Non-blocking (reminder only).
See rules/product-design.md. Fail-open on any error.
"""
import json
import sys
from pathlib import Path

# Basenames that carry a project's design tokens (colors, fonts, spacing,
# component style). Kept generic rather than an exact per-project whitelist
# so it still fires for new design-token files without config updates.
DESIGN_TOKEN_BASENAMES = {
    "colors.js", "colors.ts", "theme.js", "theme.ts",
    "typography.js", "typography.ts",
    "tailwind.config.js", "tailwind.config.ts",
    "style.css", "styles.css", "button-styles.css", "card-styles.css",
    "component_strategy.md",
    "kouendesign.swift", "kouenchrome.swift",
    "floorplan.yaml", "battery_monitor.yaml",
}


def main():
    data = json.load(sys.stdin)
    if data.get("tool_name") not in ("Edit", "Write"):
        return

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path:
        return

    path = Path(file_path)
    if path.name in ("DESIGN.md", "PRODUCT.md"):
        return  # editing the doc itself, nothing to remind about

    if path.name.lower() not in DESIGN_TOKEN_BASENAMES:
        return

    # Walk up to find a project root containing DESIGN.md (max 6 levels).
    current = path.parent
    for _ in range(6):
        design_doc = current / "DESIGN.md"
        if design_doc.exists():
            print(json.dumps({
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": (
                        f"Design-token file edited: {file_path}. "
                        f"{design_doc} exists for this project (rules/product-design.md) — "
                        f"update it in this same turn if this change altered colors, "
                        f"typography, spacing, or component style."
                    ),
                }
            }))
            return
        if current.parent == current:
            break
        current = current.parent


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
