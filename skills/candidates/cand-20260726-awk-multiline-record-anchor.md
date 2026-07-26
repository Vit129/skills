---
id: cand-20260726-awk-multiline-record-anchor
name: awk-multiline-record-line-anchor-gotcha
description: awk's ^/$ anchors match the whole multi-line RS-split record, not each embedded line — use split() + per-line regex instead
confidence_score: 0.6
hit_count: 1
created_at: 2026-07-26T21:15:00Z
last_used: 2026-07-26T21:15:00Z
source_project: ~/.claude
status: candidate
trigger_patterns:
  - "awk RS paragraph"
  - "awk multi-line record regex not matching"
  - "grep false positive on prose containing the search string"
---

# awk multiline-record anchor gotcha + grep-substring false-positive

## Context & Problem

Building `agent-memory/GATE-STATE.md` scan logic for `session-start.sh` (detect
`Status: OPEN` entries in a markdown file, print only the matching blocks). Two
distinct bugs, both on the first attempt:

1. `grep -q "Status: OPEN"` false-matched because the file's own documentation
   prose (`... surfaces every \`Status: OPEN\` entry ...`) and a template
   placeholder (`Status: <OPEN|RESOLVED>`) both contain the literal substring
   "Status: OPEN" — a bare substring search can't tell prose/docs from a real
   data entry.
2. After anchoring the grep to `^- Status: OPEN *$` (fixed bug 1), the block
   extractor — `awk 'BEGIN{RS="## GATE-"} ... /^- Status: OPEN *$/{print}'` —
   silently matched nothing even when a record legitimately contained a
   matching line. `RS="## GATE-"` makes `$0` a multi-line string per record;
   awk's `^`/`$` anchor to the start/end of that whole multi-line string, NOT
   to the start/end of each embedded line (no implicit multiline mode, unlike
   e.g. Python's `re.MULTILINE`). So a line-anchored regex against a
   multi-record `$0` matches only if that exact line happens to be the very
   first or last line of the record — never a line in the middle.

## Learned Solution

- **For self-referential-content false positives**: don't grep a file for a
  substring that the file's own template/documentation might also contain
  literally. Anchor to the actual data shape (line-start `- Field: Value`),
  and word the docs/placeholders to avoid the exact literal being searched
  for (e.g. `Status: <OPEN|RESOLVED>` instead of writing `Status: OPEN` as an
  example value in prose).
- **For awk with `RS` set to a multi-char paragraph separator**: don't rely on
  `^`/`$` regex anchors against `$0` to target one line within the record.
  Split the record into lines first and test each line individually:
  ```awk
  awk 'BEGIN{RS="## GATE-"} NR>1{
    n=split($0, lines, "\n")
    for (i=1; i<=n; i++) if (lines[i] ~ /^- Status: OPEN[ \t]*$/) { print "## GATE-" $0; break }
  }' file
  ```
  Verify empirically, not by reasoning about awk's regex engine — the failure
  mode (silently matches nothing) gives no error, easy to ship broken and not
  notice until a real case hits it.
