# Coding Principles

`[source:github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md]` — §1-5 wording synced to this upstream template.

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

- ห้ามเขียน/สร้าง หรือเปิดดู/อ่านไฟล์ HTML ที่เป็นรายงานหรือมีข้อมูลขนาดใหญ่ฝังอยู่ (เช่น graph.html ของ graphify หรือ test/coverage report) ใน workspace เป็นอันขาด เนื่องจากทำให้สิ้นเปลือง token และ context window มหาศาลในการประมวลผลของ AI (สำหรับ graphify ให้ใช้คำสั่ง query/path/explain หรือใช้ไฟล์ markdown/text แทน และสำหรับเอกสาร/รายงานอื่นๆ ให้สร้างและเขียนเป็น Markdown หรือ Text เสมอ)

## 3. Graph Before Edit

If `graphify-out/` exists in the project root, run **before the first Edit/Write**:

```
mcp__graphify__query_graph  # with query: "<symbol or concept being modified>"
```

Use the output to understand the impact surface before touching anything. Skip for trivial changes (typos, config values, docs).

## 4. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 5. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 6. Visual Output: .md vs HTML/Artifact

- **Test scene/structure docs, specs, scaffolding** → always `.md`/text. Never a checked-in `.html` file — markup overhead costs tokens on every future AI read with no readability gain (see § 2).
- **UI prototype/demo that a human needs to actually see** (layout, interaction, "does this look right?") → use the **Artifact tool**, not a workspace `.html` file. Rendering it beats describing it in chat text — chat descriptions are lossy and still cost tokens, plus the inevitable "not quite like that" rework loop.
- **Actual test scripts** (Playwright/Vitest/etc.) → stay as code (`.ts`/`.js`). They execute, they aren't viewed — HTML adds nothing.
- Treat demo/Artifact HTML as throwaway scratch. Once the human approves it, port the agreed UI into the real framework component — don't ship the demo file as production code.

## Citation Format

`[source:path/or/command] — brief note`

## Code Comments

- Comments explain **WHY**, never WHAT.
- No commented-out code in commits.

## Commit Style

```
<type>: <why this change matters>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
Subject answers "why" — the diff shows "what".

## Changelog / Release Automation

**`git-cliff`** (`brew install git-cliff`) is the standard tool for `CHANGELOG.md` generation and GitHub Release notes on any personal project that publishes tagged releases — parses the Commit Style types above via `cliff.toml`'s `commit_parsers` (feat→Added, fix→Fixed, refactor/perf→Changed, docs→Documentation; test/chore/build/ci/style skipped). Established in `kouen-terminal` and `My-Investment-Port`; also wired into `agy-plugin-cc`, `agy-plugin-codex`, `Fitness-Tracker`, `graphify`, `Hanashi`, `Home-Assistant`, `QA-Automation-Coding-Course`, `Accountant-Learning` (2026-07-19). Skip it for repos with no GitHub Releases (skill/config/notes-only repos) or for a fork whose release pipeline is upstream's to own (e.g. `CodexBar` — got `cliff.toml` for local changelog generation only, no release script, since `Scripts/release.sh` already delegates to upstream's own signed/notarized `mac-release` tool — check for an existing release script before adding one).

A typical per-project `scripts/release.sh` bumps the version (file convention varies: `package.json`/`pyproject.toml`/`Info.plist`/git-tag-only), runs `git-cliff --tag vX.Y.Z --output CHANGELOG.md`, tags, pushes, then `gh release create --notes "$NOTES"`.

**Never swallow `gh release create`/`gh release edit` errors with `2>/dev/null`** — this exact bug shipped 20 empty-body releases on `kouen-terminal` over several weeks before anyone noticed, because the fallback (`|| echo "skipped"`) never showed *why*. Capture stderr separately and print it on failure instead. Also guard `$NOTES` length before passing it to `gh release create` — GitHub's release-body cap is 125000 chars, and an empty/wrong previous-tag range (e.g. from a `mapfile`-on-bash-3.2 bug) silently dumps full project history past that limit and 422s every time.
