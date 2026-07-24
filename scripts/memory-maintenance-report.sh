#!/usr/bin/env bash
# Read-only scan of a project's agent-memory/ for maintenance candidates:
# broken [[wikilink]]s, PLAYBOOK archive candidates, and same-domain crystallize candidates.
# Writes nothing — prints a plain-text report. Usage: memory-maintenance-report.sh <agent-memory-dir>
set -euo pipefail

DIR="${1:?Usage: memory-maintenance-report.sh <path-to-agent-memory-dir>}"
DIR="$(cd "$DIR" && pwd)"

echo "=== Memory maintenance report: $DIR ==="
echo "Generated: $(date '+%Y-%m-%d %H:%M %Z')"
echo ""

echo "--- Broken links ---"
"$(dirname "$0")/memory-link-check.sh" "$DIR" || true
echo ""

# PLAYBOOK.md / playbook.md — either casing, per existing naming drift across projects
PLAYBOOK=""
for f in "$DIR/PLAYBOOK.md" "$DIR/playbook.md"; do
  [ -f "$f" ] && PLAYBOOK="$f" && break
done

echo "--- Archive candidates (PLAYBOOK) ---"
if [ -z "$PLAYBOOK" ]; then
  echo "(no PLAYBOOK.md/playbook.md — skipped)"
else
  python3 - "$PLAYBOOK" <<'PYEOF'
import sys
path = sys.argv[1]
rows = [l for l in open(path, encoding='utf-8') if l.strip().startswith('|')]
if len(rows) < 2:
    print("(no data rows)")
    sys.exit(0)
header = [c.strip() for c in rows[0].strip().strip('|').split('|')]
data_rows = rows[2:]  # skip header + separator
try:
    id_i, applied_i, prevented_i = header.index('ID'), header.index('Applied'), header.index('Prevented')
    trigger_i = header.index('Trigger')
except ValueError:
    print(f"(unrecognized PLAYBOOK schema: {header})")
    sys.exit(0)
found = False
for row in data_rows:
    cells = [c.strip() for c in row.strip().strip('|').split('|')]
    if len(cells) <= max(id_i, applied_i, prevented_i, trigger_i):
        continue
    def as_int(s):
        try: return int(s)
        except ValueError: return 0
    applied, prevented = as_int(cells[applied_i]), as_int(cells[prevented_i])
    score = applied + prevented
    if score >= 5 or (applied == 0 and prevented == 0):
        found = True
        print(f"CANDIDATE: {cells[id_i]} ({cells[trigger_i][:60]}) — Applied={applied} Prevented={prevented}")
if not found:
    print("(none)")
print("NOTE: 'no use in 30 days' clause is not checked — PLAYBOOK.md has no per-row timestamp column. Score-only heuristic; verify recency via `git log -- PLAYBOOK.md` before archiving.")
PYEOF
fi
echo ""

# INDEX.md / index.md
INDEX=""
for f in "$DIR/INDEX.md" "$DIR/index.md"; do
  [ -f "$f" ] && INDEX="$f" && break
done

echo "--- Crystallize candidates (same-domain knowledge files) ---"
if [ -z "$INDEX" ]; then
  echo "(no INDEX.md/index.md — skipped)"
else
  python3 - "$INDEX" <<'PYEOF'
import sys
from collections import defaultdict
path = sys.argv[1]
lines = open(path, encoding='utf-8').readlines()
tables = []
current = []
for l in lines:
    if l.strip().startswith('|'):
        current.append(l)
    elif current:
        tables.append(current)
        current = []
if current:
    tables.append(current)

found = False
for rows in tables:
    if len(rows) < 2:
        continue
    header = [c.strip() for c in rows[0].strip().strip('|').split('|')]
    if 'Domain' not in header or 'File' not in header:
        continue  # not the Knowledge table (e.g. Plans table)
    domain_i, file_i = header.index('Domain'), header.index('File')
    status_i = header.index('Status') if 'Status' in header else None
    by_domain = defaultdict(list)
    for row in rows[2:]:
        cells = [c.strip() for c in row.strip().strip('|').split('|')]
        if len(cells) <= max(domain_i, file_i):
            continue
        if status_i is not None and len(cells) > status_i and cells[status_i] not in ('active',):
            continue
        by_domain[cells[domain_i]].append(cells[file_i])
    for domain, files in by_domain.items():
        if len(files) >= 3:
            found = True
            print(f"CANDIDATE domain='{domain}': {len(files)} active files — {', '.join(files)}")
if not found:
    print("(none)")
PYEOF
fi
