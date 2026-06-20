# Ponytail — Lazy Senior Dev Mode

**GitHub:** https://github.com/DietrichGebert/ponytail  
**Status:** TESTING — installed 2026-06-18 via Claude Code plugin marketplace

## What it does

Makes the AI think like the laziest senior dev in the room: stops at the first rung that holds, uses stdlib/native platform features before writing anything, and writes only the minimum that works.

"He says nothing. He writes one line. It works."

## The Ladder (core rule)

Before writing any code, stop at the first rung that holds:

1. **Does this need to exist?** → YAGNI, skip it
2. **Stdlib does it?** → use it
3. **Native platform feature?** → `<input type="date">` over a picker lib, CSS over JS, DB constraint over app code
4. **Already-installed dependency?** → use it, never add a new one for what a few lines can do
5. **One line?** → one line
6. **Only then:** the minimum that works

**Never lazy about:** input validation at trust boundaries, error handling that prevents data loss, security, accessibility.

## Install (already done)

```bash
# Claude Code — already installed via:
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail

# Codex CLI (if needed)
codex plugin marketplace add DietrichGebert/ponytail

# Gemini CLI / Agy
gemini extensions install https://github.com/DietrichGebert/ponytail
agy plugin install https://github.com/DietrichGebert/ponytail

# Kiro — copy .kiro/steering/ from repo
```

## Activation

| Action | Command |
|--------|---------|
| Set mode | `/ponytail lite\|full\|ultra` |
| Review mode | `/ponytail-review` (audit for over-engineering) |
| Deactivate | "stop ponytail" / "normal mode" |
| Trigger keywords | "ponytail", "be lazy", "simplest solution", "yagni", "do less", "shortest path" |

Default mode: `full`. Active every session until explicitly stopped.

## Modes

| Mode | Description |
|------|-------------|
| `lite` | Minimal hints — gentle nudge toward simplicity |
| `full` | Default — full lazy rules active |
| `ultra` | Aggressively minimal — for when the codebase has wronged you personally |
| `review` | Audit mode — scans existing code for over-engineering |

Configure default: `PONYTAIL_DEFAULT_MODE=full` env var or `~/.config/ponytail/config.json`.

## Benchmark (agentic, real Claude Code sessions)

Tested on Claude Code editing FastAPI + React repo, 12 feature tickets, Haiku 4.5, n=4:

| Metric | Change vs no-skill |
|--------|--------------------|
| Lines of code | **-54%** (up to -94% on over-build traps) |
| Tokens | **-22%** |
| Cost | **-20%** |
| Time | **-27%** |
| Safety | **100%** (no dropped validations) |

The only arm that cuts every metric and stays fully safe.

## ponytail: comment

Mark deliberate simplifications with a `ponytail:` comment:

```python
# ponytail: global lock, per-account locks if throughput matters
```

Simple reads as intent, not ignorance. Shortcut with a known ceiling → name the ceiling and upgrade path.
