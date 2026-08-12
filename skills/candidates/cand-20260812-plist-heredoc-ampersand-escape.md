---
id: cand-20260812-plist-heredoc-ampersand-escape
name: plist-heredoc-unescaped-ampersand
description: writing a launchd plist via a bash heredoc with a literal shell redirect (2>&1) produces invalid XML that macOS tolerates loosely but behaves unreliably — escape or avoid the redirect entirely
confidence_score: 0.6
hit_count: 1
created_at: 2026-08-12T09:40:00Z
last_used: 2026-08-12T09:40:00Z
source_project: stock-report-bot
status: candidate
trigger_patterns:
  - "launchd job unreliable"
  - "plist lint error"
  - "unknown ampersand-escape sequence"
  - "cat > *.plist heredoc"
---

# Generating a launchd plist via bash heredoc — the `2>&1` XML trap

## Context & Problem

Wrote a small installer script (`scripts/install-plist.sh`) that generates a `.plist` file via a
bash heredoc (`cat > "$PLIST_PATH" <<EOF ... EOF`), embedding a shell command string like:
```
<string>/path/to/script.sh >> /path/to/log 2>&1</string>
```
This is INVALID XML — a bare `&` must be `&amp;` inside an XML document. `plutil -lint` correctly
flagged it ("unknown ampersand-escape sequence"), but macOS's own plist loader was lenient enough
to still load the job and mostly run it — behavior was inconsistent/unreliable in ways that took
real debugging time to trace back to the XML validity itself (chased a red herring — see the
companion candidate on silent-success scripts — before finding this).

## Learned Solution

- **Always run `plutil -lint <path>.plist`** immediately after generating or hand-writing any
  plist, especially one built by string concatenation/heredoc rather than a proper plist-writing
  library. Don't trust "it loaded and `launchctl list` shows it running" as proof the XML is valid
  — macOS's loader can be lenient about malformed entities in ways that mask real problems.
- When generating a plist programmatically, prefer **`plistlib.dump()`** (Python) or an equivalent
  proper serializer over string/heredoc templating — it handles escaping correctly by
  construction. If you must template a string, XML-escape it yourself (`&` → `&amp;`, `<` → `&lt;`,
  `>` → `&gt;`) before interpolating.
- Simpler still: avoid embedding a shell redirect inside `ProgramArguments` at all. Use the
  plist's own **`StandardOutPath`/`StandardErrorPath`** keys instead of `/bin/bash -c "cmd >> log
  2>&1"` — this sidesteps the whole escaping question (no `&`/`>` characters to escape in the
  first place) and is the more idiomatic launchd pattern anyway.
