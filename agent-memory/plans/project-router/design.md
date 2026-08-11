# Content-based project router for Kouen Task Sync — Design

## Context

User watched a Thai review of Hermes Agent (NousResearch) showing content-based auto-routing — type a free note ("went to the gym"), it auto-files under the right project. Researched Hermes's actual implementation (verified via `gh api`/`gh pr view`/`gh issue view`, not hallucinated): that specific capability is **unshipped** in Hermes itself (open, unmerged PR #52987 — only deterministic path/git-remote routing ships today). Decision made with the user: don't install Hermes, build a small equivalent of our own instead, reusing infra we already have.

Gap: `~/.claude/rules/routing.md`'s **Kouen Task Sync** section (lines 78-98), step 2, has exactly one signal for guessing which project an open Kouen Task belongs to — cross-referencing `sessionID` against a still-open Kouen session's `cwd`. Only works while the session is open (line 82's documented constraint). The hard confirm-first rule at line 84 must not be weakened.

User decision (AskUserQuestion, 2026-08-10): router covers `~/Git/Personal/*` only by default; `~/Git/Company/*` opt-in via `--include-company` flag.

## Strategic Design

**Bounded context:** single "personal workspace tooling" context, same one that already contains `memory_vector_search.py` and `memory-decay-scheduler.sh`. No case for multi-service split — one human, one machine, local-only embedding model, no network calls, trivial query volume (a handful of Kouen tasks per manual sync).

**Module boundary:**
- IN (`project_router.py`, new): discovering candidate Personal projects, building/maintaining an mtime-cached embedding index of each project's identity text, given a free-text query producing a ranked scored candidate list, printing that list as plain-text stdout. Nothing more.
- OUT (unchanged in `routing.md`): the actual `kouenTaskList`/`Get`/`Create`/`Update`/`Delete` calls; the confirm-with-user step (step 3); the existing cwd cross-reference signal (step 2's first half); the done:true cleanup sub-flow (steps 94-98, only touched by a one-line cross-reference).

This script is a read-only advisory signal generator that slots into step 2 as a second candidate source — never a replacement for steps 3-6.

## Tactical Design

**`ProjectIdentity`** (conceptual, one per discovered project dir):

| Field | Type | Meaning |
|---|---|---|
| `path` | `Path` | Absolute path to project root |
| `name` | `str` | `path.name` |
| `sources` | `list[str]` | Subset of `["README.md", "PRODUCT.md"]` that contributed text, or `[]` for name-only fallback |
| `text` | `str` | Concatenated, truncated text actually embedded |
| `mtime` | `float` | `max()` of mtimes of files in `sources`, or dir's own mtime if `sources == []` |

**Index shape** (`agent-memory/.state/project-router-index.json`, sibling to `memory-vectors.json`/`memory-passive-review-state.json`):

```json
{
  "/Users/supavit.cho/Git/Personal/kouen-terminal": {
    "mtime": 1754812345.0,
    "sources": ["README.md", "PRODUCT.md"],
    "vector": [0.0123, -0.0456, ...]
  }
}
```

Invalidation: re-embed if `sources` differs from current discovery OR `mtime` differs from `max(mtime of current sources)` — not mtime alone, so losing a source file is detected even if the remaining file's own mtime is unchanged.

**Query contract:** input = free-text string (Kouen task title) + `--include-company`/`--min-score`/`--margin`/`--limit`. Output (in-process) = ranked `list[tuple[ProjectIdentity, float]]`, cosine similarity via normalized dot product (same math as `memory_vector_search.py::search()`). Output (stdout) = always a candidate-guess list or an explicit "no confident match" message — never a silent pick.

## Logical Design

### `~/.claude/scripts/project_router.py` (new)

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["sentence-transformers", "numpy"]
# ///
```

```python
CLAUDE_DIR = Path.home() / ".claude"
INDEX_PATH = CLAUDE_DIR / "agent-memory" / ".state" / "project-router-index.json"
MODEL_NAME = "all-MiniLM-L6-v2"
MAX_CHARS_PER_SOURCE = 900   # explicit truncation before MiniLM's own silent 256-wordpiece cutoff

PERSONAL_ROOT = Path.home() / "Git" / "Personal"
COMPANY_ROOT = Path.home() / "Git" / "Company"
SKIP_PROJECTS = {"9arm-skills"}       # no-touch, core.md
SKIP_DIR_NAMES = {"untitled folder"}  # confirmed junk

MIN_ABS_SCORE = 0.15   # placeholder, needs first-run calibration
MIN_MARGIN = 0.03      # top score must beat runner-up by this much
```

**Discovery** — `discover_projects(include_company) -> list[Path]`: walks `PERSONAL_ROOT` always, `COMPANY_ROOT` only if `--include-company`, `is_dir()`, explicitly skips dotdirs (Python's `iterdir()` doesn't filter these the way bash's bare glob does), skips `SKIP_PROJECTS`/`SKIP_DIR_NAMES`.

**Identity text, 3-tier fallback** — `build_identity_text(project_dir) -> (text, sources, mtime)`:
1. `README.md` + `PRODUCT.md` if present, each truncated to 900 chars, concatenated (fits both within MiniLM's ~256-wordpiece window without one starving the other).
2. If only one exists, use that one.
3. Neither exists (rare — 2/20 real dirs workspace-wide) → fall back to `project_dir.name` alone, `sources: []`.

**Index build** — mirrors `memory_vector_search.py::build_index()`: mtime+sources-aware cache, `SentenceTransformer(MODEL_NAME).encode(..., normalize_embeddings=True)`, prune stale keys no longer discovered.

**Query/CLI:**
```
project_router.py "<task title>" [--include-company] [--limit N] [--min-score] [--margin] [--show-all] [--reindex-all]
```

**Confidence gating at print-time** (always compute, gate the message):
- Confident (top score ≥ `MIN_ABS_SCORE` AND beats runner-up by ≥ `MIN_MARGIN`): print ranked list, top row is "the" candidate guess.
- Not confident: print `"No confident content-based match (best guess below threshold or too close to runner-up) — cwd cross-reference and manual confirm are still required."`, exit 0 — successful run, negative result.
- Zero projects discovered at all: stderr message + exit 1 — genuine prerequisite failure, distinct from "ran fine, nothing confident."

**Example output:**
```
$ uv run project_router.py "went to the gym"
0.312  ~/Git/Personal/Fitness-Tracker
0.104  ~/Git/Personal/Home-Assistant
0.081  ~/Git/Personal/graphify
```

**Threshold calibration** — `MIN_ABS_SCORE`/`MIN_MARGIN` are explicitly-flagged placeholders (MiniLM cosine on short-query-vs-long-doc typically compresses ~0.1-0.4, not 0-1). Calibrate later by running `--show-all` against 5-10 real past Kouen task titles with known correct projects. Not blocking initial ship.

### `~/.claude/rules/routing.md` diff (Kouen Task Sync section — 3 line edits only)

- **Line 88** (append): reference `project_router.py` as a second, weaker, content-based guess; Personal-only by default; disagreement between signals must be stated, not silently resolved.
- **Line 89** (reword): name both signals explicitly in the presented-detail list ("cwd-based guess if any, content-based guess if any/confident").
- **Line 96** (clarify): "full project cross-reference from step 2 above" now explicitly covers both signals for the done:true cleanup sub-flow too.

No other lines change. Steps 4-6 untouched. Line 84's confirm-first rule unweakened.

## Verification

1. `uv run project_router.py --reindex-all "test"` — builds index over real `~/Git/Personal/*` (12 dirs minus `9arm-skills`), no crash on any no-README/PRODUCT.md dir.
2. `uv run project_router.py "went to the gym"` — expect `Fitness-Tracker` top-ranked with a visibly higher score than runner-ups.
3. `uv run project_router.py "some ambiguous vague text"` — expect "No confident content-based match" message, not a forced guess.
4. Confirm `agent-memory/.state/project-router-index.json` created; second run doesn't re-embed unchanged files; touching one project's README.md re-embeds only that entry.
5. Read back the 3 edited `routing.md` lines — diff applied cleanly, line 84 untouched.
