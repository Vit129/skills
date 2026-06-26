---
name: agy
version: 1.0.0
description: Antigravity (agy) CLI companion - delegate substantial coding/debugging tasks to agy via the shared runtime. Activates on explicit /agy or intent like "ask agy", "have agy try this", "second opinion from agy"
---

# Agy Companion

Agy is the Antigravity CLI companion, invoked through the `agy-plugin-cc` plugin. It runs as a separate agent with its own context — use it to hand off substantial work, not for things the main thread can finish quickly itself.

## Two invocation modes

**1. `/agy "<prompt>"` (slash command)**
- Runs `agy -p "<prompt>"` non-interactively and prints the response.
- Use for one-shot, well-scoped prompts where you already know exactly what to ask.

**2. `agy-rescue` subagent (proactive)**
- A thin forwarding wrapper around `agy-companion.mjs task ...` (Bash-only).
- Use proactively when the main Claude thread is stuck, wants a second implementation/diagnosis pass, needs deeper root-cause investigation, or should hand off a substantial coding task.
- Do NOT grab simple asks the main thread can finish on its own.

## Delegation scope

Good fits for agy:
- Open-ended or multi-step debugging that's stalled in the main thread
- Independent second-opinion implementations to compare against
- Long-running investigation/root-cause work suited to background execution

Not a fit:
- Quick lookups, small edits, or anything resolvable in 1-2 tool calls
- Repository exploration that Claude/Graphify can do directly

## Routing controls

- `--continue` — resume agy's last conversation (use when the user says "continue", "keep going", "apply the top fix", "dig deeper")
- `--fresh` — start a new agy conversation (default if no continuation signal)
- `--background` vs foreground — prefer foreground for small, clearly bounded requests; prefer background for complex, open-ended, or long-running tasks
- Leave `--model` unset unless the user explicitly requests a specific model

## Usage patterns observed in this workspace

- Paired with `research-idea` and `notebooklm` flows (Terry research pipeline) for deep-dive investigation steps
- Paired with `ha-dev` for debugging Home Assistant automations
- Forward the user's task text as-is; only use `gemini-3-prompting` to tighten the prompt, never to do independent analysis

## Result handling

- Return agy's output as-is; do not add commentary before/after
- Do not poll status, inspect the repo, or do follow-up work on agy's behalf — that belongs to the main thread after agy returns
