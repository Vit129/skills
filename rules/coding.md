# Coding Principles

## 1. Think Before Coding

- State assumptions explicitly. If multiple interpretations exist, present them.
- Push back when a simpler approach exists. Surface tradeoffs.
- If unclear, stop and ask — don't guess.

## 2. Simplicity First

- Minimum code that solves the problem. No speculative features or abstractions.
- No "flexibility" that wasn't requested. If 200 lines could be 50, rewrite.
- Ask: "Would a senior engineer say this is overcomplicated?"
- ห้ามเขียน/สร้าง หรือเปิดดู/อ่านไฟล์ HTML ที่เป็นรายงานหรือมีข้อมูลขนาดใหญ่ฝังอยู่ (เช่น graph.html ของ graphify หรือ test/coverage report) ใน workspace เป็นอันขาด เนื่องจากทำให้สิ้นเปลือง token และ context window มหาศาลในการประมวลผลของ AI (สำหรับ graphify ให้ใช้คำสั่ง query/path/explain หรือใช้ไฟล์ markdown/text แทน และสำหรับเอกสาร/รายงานอื่นๆ ให้สร้างและเขียนเป็น Markdown หรือ Text เสมอ)

## 3. Graph Before Edit

If `graphify-out/` exists in the project root, run **before the first Edit/Write**:

```
mcp__graphify__query_graph  # with query: "<symbol or concept being modified>"
```

Use the output to understand the impact surface before touching anything. Skip for trivial changes (typos, config values, docs).

## 4. Surgical Changes

- Touch only what the task requires. Don't improve adjacent code uninvited.
- Match existing style even if you'd do it differently.
- Remove only orphans YOUR changes created — not pre-existing dead code.

## 5. Goal-Driven Execution

- Transform tasks into verifiable goals with explicit success criteria.
- State a brief numbered plan for multi-step work. Loop until verified.
- Weak criteria ("make it work") → ask for clarification before proceeding.

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
