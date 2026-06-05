---
name: ui-to-text
description: >
  Convert UI from any source (screenshot, Figma, or live Chrome DevTools) into structured
  knowledge base entries for agent-memory/knowledge/biz/ (LLM Wiki pattern).
  Primary goal: build persistent KB so AI never re-discovers UI structure from scratch.
  Trigger: "แปลง UI เป็น text", "UI to text", "describe this screen", "อธิบาย UI",
  "extract UI elements", "screen to text", "mockup to description",
  "วิเคราะห์หน้าจอ", "UI description", "แปลง screenshot เป็น text",
  "อ่าน UI ให้หน่อย", "UI inventory", "สร้าง KB จาก UI", "build KB",
  "ingest UI", "chrome devtools KB", "figma KB", "screenshot KB"
version: 2.0.0
last_improved: 2026-06-03
improvement_count: 1
credit: LLM Wiki pattern by Karpathy (https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
---

# UI to Text — Knowledge Base Builder

Convert UI into structured KB entries for `agent-memory/knowledge/biz/`.
Goal: compile knowledge once → AI reuses forever (LLM Wiki pattern).

> **Primary output:** `agent-memory/knowledge/biz/{feature}.md` — NOT just chat output.
> Every ingest MUST produce a persistent file. Chat-only output = incomplete.

---

## Smart Router — KB-First with Figma Fallback

**Core rule:** หน้าไหน KB มีแล้ว → ใช้ KB | หน้าไหนยังไม่มี → Figma → สร้าง KB ไปในตัว

```text
Agent needs UI info for page X
        │
        ▼
Check: agent-memory/knowledge/biz/ มี page X มั้ย?
        │
   ┌────┴────┐
   │ YES     │ NO
   ▼         ▼
 Use KB     Figma available?
 (fast,     ├── YES → Figma MCP → extract → write KB → continue
 0 token)   ├── NO but screenshot available → Screenshot → write KB → continue
            └── NO and app accessible → Chrome DevTools → write KB → continue
```

### Incremental Build Pattern (across sprints)

```text
Sprint 1: Login → Home → Feature P1, P2
  ├── Login KB: ❌ → Figma → สร้าง KB ✅
  ├── Home KB: ❌ → Figma → สร้าง KB ✅
  └── Feature P1,P2 KB: ❌ → Figma → สร้าง KB ✅

Sprint 2: Login → Home → Feature P1,P2 → Feature P3,P4, Success
  ├── Login KB: ✅ → use KB (ไม่ต้อง Figma)
  ├── Home KB: ✅ → use KB (ไม่ต้อง Figma)
  ├── Feature P1,P2 KB: ✅ → use KB (ไม่ต้อง Figma)
  └── Feature P3,P4,Success KB: ❌ → Figma → สร้าง KB ✅

Sprint N: KB ครบเกือบทุกหน้า → Figma เรียกเฉพาะหน้าใหม่เท่านั้น
```

**Result:** ยิ่ง sprint เยอะ → Figma ถูกเรียกน้อยลง → เร็วขึ้นเรื่อยๆ (compound effect)

### Router Decision (agent ทำ auto — ไม่ต้องถาม user)

```text
for each page in user's requested flow:
  if KB exists for this page:
    → read KB, continue to next page
  else:
    → pick best available source:
        1st priority: Figma (ถ้ามี link/node ID)
        2nd priority: Screenshot (ถ้า user attach)
        3rd priority: Chrome DevTools (ถ้า app accessible)
    → ingest → write KB → continue to next page
```

**Agent ไม่ต้องถาม "จะใช้ source ไหน" ทุกหน้า** — ถามครั้งเดียวตอนเริ่ม session:
- "มี Figma link มั้ย?" → ถ้ามี = ใช้ Figma เป็น default สำหรับทุกหน้าใหม่
- ถ้าไม่มี → fall back to screenshot/DevTools

---

## Source Types & Workflow

### Source A: Screenshot / Image (fastest)

**When to use:** User has screenshots ready. Best for quick KB building.

**Steps:**
```text
1. User attaches image(s) to chat
2. Agent analyzes: layout → clickable elements → states → navigation
3. Write KB file to agent-memory/knowledge/biz/{feature}.md
4. Update knowledge/index.md
5. Mark missing sub-pages with 🟡
```

**Token cost:** Low — image tokens fixed regardless of complexity

---

### Source B: Chrome DevTools (live app — most accurate)

**When to use:** App is accessible, need exact labels/locators for test writing.

**Steps:**
```text
1. Navigate to the target page
2. take_snapshot → get a11y tree (role, name, state of every element)
3. Filter: keep only interactive elements (button, link, input, combobox, tab)
4. Extract: label text, role, current state (disabled/enabled/selected)
5. Cross-check with take_screenshot for visual context
6. Write KB file to agent-memory/knowledge/biz/{feature}.md
```

**DevTools Tool Sequence:**
```text
navigate_page(url)
  → take_snapshot()           ← a11y tree: exact labels + roles
  → take_screenshot()         ← visual: layout, colors, states
  → evaluate_script(fn)       ← only if need to extract dynamic data
```

**What to extract from a11y tree:**
- `button` role → clickable buttons
- `link` role → navigation links
- `tab` role → tab panels
- `combobox` / `listbox` → dropdowns
- `textbox` / `searchbox` → inputs
- `checkbox` / `radio` → toggles
- Ignore: `img`, `StaticText` (unless it's a label for an element)

**Token cost:** Higher than screenshot — a11y tree can be large. Filter aggressively.

---

### Source C: Figma MCP (design source — most complete)

**When to use:** Figma Power is installed, design file is available, need full component spec.

**Steps:**
```text
1. Get Figma file URL or node ID from user
2. Use Figma MCP tools to fetch frame/component data
3. Extract: component hierarchy, interactive elements, variants, auto-layout
4. Write KB file to agent-memory/knowledge/biz/{feature}.md
```

**Figma MCP notes:**
- Use `figma` power → activate first to get tool names
- Focus on: frame names, component names, visible text, button variants
- Skip: exact pixel values, color tokens (unless design system matters)
- If Figma Power not installed → fall back to screenshot mode

**Token cost:** Medium — structured JSON from Figma API is compact

---

## KB Output Format (MANDATORY for all sources)

All sources must produce this format in `agent-memory/knowledge/biz/{feature}.md`:

```markdown
# {Feature Name} — UI Knowledge Base

> Source: {Screenshot | Chrome DevTools | Figma} | Role: {role if applicable}
> App: {URL if known}
> Last updated: {YYYY-MM-DD}

---

## Navigation Map

\`\`\`text
{parent page} → {this page}
  ├── {sub-page 1} (via {button/link label})
  ├── {sub-page 2} (via {button/link label})
  └── {sub-page 3} (via {button/link label})
\`\`\`

---

## {Page Name}

### Entry Point
- From: {parent} → click "{label}"

### Clickable Elements

| Element | Type | Label | Action/Notes |
|---------|------|-------|--------------|
| {name} | Button/Tab/Link/Input/Filter | {visible text} | {what happens or where it goes} |

### States (if applicable)

| State | Indicator | Notes |
|-------|-----------|-------|
| {state name} | {color/icon/badge/disabled} | {meaning for testing} |

### Role-Based Access (if applicable)

| Feature | Role A | Role B |
|---------|--------|--------|
| {feature} | ✅ / ❌ | ✅ / ❌ |

---

## 🟡 Missing Pages (need screenshot/exploration)

- [ ] {Sub-page 1} — entry: click "{button}"
- [ ] {Sub-page 2} — entry: click "{button}"
```

---

## What to Capture vs Skip

| ✅ Capture | ❌ Skip |
|-----------|---------|
| Button/link labels (exact text) | Static display text (prices, counts, dates) |
| Tab names + which tab is active | CSS classes, IDs, data-testid |
| Input placeholders | Pixel dimensions, colors |
| Dropdown options (if visible) | Internal API endpoints |
| Disabled/enabled state | Animation timing |
| Role-based access (can/cannot) | Content inside data tables |
| Navigation paths | Repeated patterns (note once, reference after) |
| Status badges + colors | Decorative images |

---

## Output Routing

| Context | Output goes to |
|---------|---------------|
| Building biz KB (primary) | `agent-memory/knowledge/biz/{feature}.md` |
| QA test scenario design | Feed directly to `qa/test-scenario` Phase 2.2 |
| Architecture notes | `agent-memory/knowledge/arch/{feature}.md` |
| Quick chat (no persistence) | Only if user explicitly says "just tell me, don't save" |

**Default behavior:** ALWAYS write to KB file. Never chat-only unless user explicitly requests it.

---

## Multi-Page Ingest Strategy

When ingesting an entire feature (multiple pages):

```text
Session planning:
1. Start with Dashboard/Home → establish navigation map
2. Explore each top-level feature → fill in nav map
3. For each feature: List page → Detail page → Create/Edit form
4. Mark each page as:
   ✅ Done      → content written to KB
   🟡 Missing   → seen a link/button to it, not yet explored
   ❌ No access → role restriction confirmed

Stop when: all ✅ or user says "enough for now"
```

---

## Chrome DevTools Practical Workflow

### Step 1: Navigate and snapshot

```text
navigate_page(url: "https://app.example.com/feature")
→ wait_for(text: ["Page Title", "Main Heading"])
→ take_snapshot()
```

### Step 2: Filter a11y tree

From snapshot, extract ONLY:
```text
button, link, tab → clickable navigation
textbox, searchbox, combobox → inputs
checkbox, radio, switch → toggles
Skip: img, StaticText (non-interactive), generic landmark regions
```

### Step 3: Screenshot for visual context

```text
take_screenshot()
→ note: layout zones, color coding of status badges,
         which tabs are active, disabled elements
```

### Step 4: Explore sub-pages

For each clickable element that leads to a new page:
```text
click(uid: {uid})
→ wait_for(text: [{expected heading}])
→ take_snapshot()
→ extract clickable elements
→ navigate_page(type: "back")
```

### Step 5: Write KB file

Compile all findings → write to `agent-memory/knowledge/biz/{feature}.md`

---

## Hard Rules

- NEVER hallucinate elements not seen in source
- NEVER write chat-only KB (must persist to file)
- If text is unreadable → mark `[unreadable]`, don't guess
- If access is role-restricted → mark `❌ no access` not skip silently
- ALWAYS note source type (Screenshot/DevTools/Figma) in KB file header
- ALWAYS update `knowledge/index.md` after writing new KB file
- ALWAYS mark 🟡 for pages you know exist but haven't captured yet

---

## Integration with LLM Wiki Pipeline

```text
UI Source (Screenshot / DevTools / Figma)
        │
        ▼
  ui-to-text → agent-memory/knowledge/biz/{feature}.md  (Stage 1: clickable elements + nav)
        │
        ├──► ux-ui/ui-designer (figma.md) → deep analysis (business rules + states + edge cases)
        ├──► qa/test-scenario Phase 2.1 → reads KB → plans tasks
        ├──► qa/test-scenario Phase 2.2 → reads KB + figma analysis → writes entry points + edge cases
        └──► qa/playwright-testing Phase 2.4 → reads KB → writes correct locators
```

### Related Skills

| When you need... | Use instead/also |
|-----------------|-----------------|
| **Clickable elements + navigation map** (KB building) | This skill (`tooling/ui-to-text`) |
| **Business rules + validation + error states from UI** (test design) | `ux-ui/ui-designer/references/figma.md` |
| **Both** | Run `ui-to-text` first (Stage 1 KB) → then `figma.md` for deep analysis (Stage 2) |

**Compound effect:** Every KB page built today = faster test writing for all future features in this area.

---

## Verification

Before declaring KB ingest complete, confirm:

- [ ] Source type noted in file header (Screenshot/DevTools/Figma)
- [ ] Navigation map written (even if partial)
- [ ] Clickable elements table complete for this page
- [ ] Missing sub-pages marked with 🟡
- [ ] File written to `agent-memory/knowledge/biz/{feature}.md`
- [ ] `knowledge/index.md` updated with new entry
- [ ] No hallucinated elements (only what was seen)

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Screenshot / a11y snapshot / Figma data | Visual input | Primary source |
| Chrome DevTools MCP tools | Browser automation | Live page exploration |
| Figma Power (optional) | MCP server | Design file access |
| `agent-memory/knowledge/biz/` | Output location | KB persistence |
| `knowledge/references/ingest-and-maintenance.md` | Guide | Format standards + lint rules |

## Human-in-the-Loop Points

| Step | Type | When |
|------|------|------|
| Source type selection | Single select (Screenshot/DevTools/Figma) | When source ambiguous |
| Page coverage scope | Open field | "Which pages do you want in KB?" |
| Role context | Single select | "Which user role am I documenting?" |
| After each page written | Checkbox | Confirm before moving to next page |

---

## Self-Learning

After KB is built and used in test scenarios/scripts:

1. **Record pattern:** If KB led to 0-retry test scripts → note in `knowledge/lessons/tooling/`
2. **Record failures:** If KB was wrong/stale → note in playbook for lint reminder
3. **Promote:** If same UI pattern appears in 3+ features → crystallize to `knowledge/business/`

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session
- **Hook:** `skill-improve.json` logs user corrections (silent)
- **Promotion:** 3x same issue → auto-apply fix to this SKILL.md + bump version
