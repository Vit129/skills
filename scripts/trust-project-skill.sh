#!/usr/bin/env bash
# trust-project-skill.sh — record a project root as trusted to source
# project-local skills from (_skills/, .claude/skills/), so
# hooks/project-skill-trust-gate.py stops denying reads of its SKILL.md
# files. Mirrors Hermes Agent's own `hermes skills trust <path>` (PR #88566)
# -- see agent-memory/knowledge/ or Claude Code memory reference_hermes_agent.md
# for why this gate exists (repo-vendored skills are a prompt-injection vector).
#
# Usage: trust-project-skill.sh <project-root-path>
set -euo pipefail

TRUST_FILE="$HOME/.claude/agent-memory/.state/skill-trust.json"
ROOT="$(cd "${1:?usage: trust-project-skill.sh <project-root-path>}" && pwd)"

mkdir -p "$(dirname "$TRUST_FILE")"
[ -f "$TRUST_FILE" ] || echo '{}' > "$TRUST_FILE"

python3 - "$TRUST_FILE" "$ROOT" <<'EOF'
import json, sys
from datetime import datetime, timezone

trust_file, root = sys.argv[1], sys.argv[2]
with open(trust_file) as f:
    data = json.load(f)

data[root] = {"trusted_at": datetime.now(timezone.utc).isoformat()}

with open(trust_file, "w") as f:
    json.dump(data, f, indent=2, sort_keys=True)
    f.write("\n")

print(f"trusted: {root}")
EOF
