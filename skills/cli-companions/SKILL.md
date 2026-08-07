---
name: cli-companions
version: 1.0.0
description: Selection criteria between agy (Antigravity) and codex-rescue (OpenAI Codex) CLI companion delegation — use when deciding which external companion to hand a task to, or when the user says "use agy", "ask agy", "codex rescue", "delegate to codex".
---

# CLI Companions — agy vs codex-rescue

Both run as a separate agent, own context, own quota — used to hand off substantial work the main thread shouldn't burn its own context/turns on. Neither should grab a quick ask the main thread can finish in 1-2 tool calls.

## Pick agy when

- User explicitly names it ("ask agy", "have agy try this", "second opinion from agy") — see `skills/agy/SKILL.md`.
- Want an independent second-opinion implementation to compare against the main thread's own approach.
- Task is paired with existing agy-based flows already in this workspace (`research-idea`/`notebooklm` deep-dive steps, `ha-dev` Home Assistant debugging).

## Pick codex-rescue when

- Main Claude thread is stuck/looping and needs a fresh diagnosis pass, or the user says "codex rescue"/"delegate to codex"/"rescue this".
- Task benefits from a write-capable run (`--write` is codex-rescue's default) — agy's flow doesn't default to writing.
- Want `--resume-last` continuation semantics ("continue", "keep going", "apply the top fix", "dig deeper" on *prior Codex work specifically*).
- Want a smaller/cheaper/faster model pass (`--model`, `spark` → `gpt-5.3-codex-spark`).

## Shared routing controls (both)

- Foreground for small bounded asks, background for open-ended/long-running ones — neither should default to background just because it's easier.
- Leave `--model`/`--effort` unset unless user explicitly asks for a specific one.
- Continue vs fresh: "continue"/"keep going"/"resume"/"apply the top fix"/"dig deeper" → resume that *same* companion's last session, not the other one. Don't cross-resume agy state into codex or vice versa.
- Both return the companion's output as-is — no added commentary, no follow-up work (polling, inspecting repo, summarizing) on the companion's behalf. That belongs to the main thread after it returns.

## Not a fit for either

Quick lookups, small edits, anything resolvable in 1-2 tool calls, or repo exploration Claude/Graphify can already do directly.

## Note

Only two CLI-companion plugins are installed in this workspace: `agy-plugin-cc` and `openai-codex`. No `gemini-plugin-cc`/`gemini-rescue` companion is installed — don't route to one.
