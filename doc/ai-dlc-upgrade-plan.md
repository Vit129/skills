# AI-DLC Full Upgrade Plan
# Knowledge Evolution Integration + Claude Code Internals Insights

วันที่: 2026-04-12 (revised with leaked source insights)
สถานะ: Ready to Execute — all tasks reset to TODO

Reference:
- `system/knowledge-evolution/KNOWLEDGE_EVOLUTION_README.md`
- Claude Code leaked source (codeaashu/claude-code) — architecture, tool system, skill system, dream system
- Claude Code best practices (shanraisshan/claude-code-best-practice) — tips, skill design, hook patterns

---

## Insights จาก Claude Code Source ที่นำมาใช้

### จาก Leaked Source (Architecture + Internals)

| Insight | มาจากไหน | นำมาใช้ยังไง | Task |
|---------|----------|-------------|------|
| **Tool Definition Pattern** — ทุก tool มี inputSchema (Zod), checkPermissions, isConcurrencySafe, isReadOnly, prompt injection | `src/tools/<ToolName>/` | ปรับ SKILL.md ให้มี concurrency + isolation hints เพื่อบอก agent ว่า skill นี้ safe to run parallel หรือไม่ | 0.4 ✅ |
| **Progressive Disclosure 3 ระดับ** — metadata (always) → SKILL.md body (on trigger) → references (on demand) | `src/skills/loadSkillsDir.ts` | ตรวจ SKILL.md ทุกตัวว่าทำ 3 ระดับถูกหรือยัง — ย้าย content หนักไป references/ | 0.3 ✅ |
| **Dream System (Auto-Consolidation)** — Orient→Gather→Consolidate→Prune background loop | `src/services/autoDream/` | ใช้เป็น model สำหรับ memory-palace auto-consolidation hook (Phase D2) | D2 ✅ |
| **Skill description = trigger condition** — Claude Code ใช้ description field ตัดสินว่าจะ fire skill หรือไม่ | `src/skills/` | ปรับ description ทุก SKILL.md ให้เป็น trigger-style | 0.1 ✅ |
| **Context Fork** — skill รันใน isolated subagent, main context เห็นแค่ result | `src/skills/` | เพิ่ม `context: fork` hint ใน skills ที่ควร isolate | 0.4 ✅ |
| **Parallel Prefetch** — fire side-effects ก่อน heavy module load | `src/main.tsx` startup | ปรับ session-start hook ให้ prefetch memory + knowledge index พร้อมกัน | K5 ✅ |
| **Permission Wildcards** — `Bash(git *)`, `FileEdit(/src/*)` | `src/hooks/toolPermission/` | document ใน hook-creator skill เพื่อลด permission prompts | 0.7 ✅ |
| **Bundled Skills** — simplify, verify, stuck, remember, skillify, debug, batch | `src/skills/bundled/` | document ใน SKILLS_README.md ว่ามี built-in skills อะไรบ้าง ไม่ต้องสร้างซ้ำ | 0.6 ✅ |

### จาก Leaked Source — Deep Analysis (community breakdowns)

Sources: [blakecrosley.com](https://blakecrosley.com/blog/claude-code-source-leak), [wiz.jock.pl](https://wiz.jock.pl/articles/claude-code-source-leak-what-to-learn-ai-agents-2026/), [skilldb.dev](https://skilldb.dev/blog/claude-code-leaked-what-500k-lines-teach-us-about-agent-skills), [wavespeed.ai](https://wavespeed.ai/blog/posts/claude-code-hidden-features-leaked-source-2026/), [digitalapplied.com](https://www.digitalapplied.com/blog/claude-code-leak-agentic-architecture-lessons-2026), [elliotarledge.com](https://elliotarledge.com/blog/claude-code-leak), [mindstudio.ai](https://www.mindstudio.ai/blog/claude-code-source-leak-three-layer-memory-architecture/)

| Insight | นำมาใช้ยังไง | Task |
|---------|-------------|------|
| **3-Layer Memory: Permanent Index → Working Context → Skeptical Memory** — recalled facts เป็นแค่ hints ต้อง verify ก่อน act | ปรับ memory-palace session-start: load hall.md เป็น "hints" → verify กับ actual files ก่อนใช้ | 0.8 ✅ |
| **autoDream trigger: 5+ sessions / 24h cooldown** — consolidation threshold จริงจาก source | ปรับ D2 hook: sessions_since ≥ 5 (ตรงกับ source) | D2 ✅ |
| **Prompt Cache: 14 break vectors + sticky latches** — แก้ CLAUDE.md mid-session = cache หายตลอด session | เพิ่ม rule ใน CLAUDE.md: "ห้ามแก้ CLAUDE.md, rules, MCP config ระหว่าง session" | 0.9 ✅ / K1 ✅ |
| **Autocompact Circuit Breaker (MAX=3)** — เคยเสีย 250K API calls/day | เพิ่ม Gotcha: ถ้า compaction failed ซ้ำ → switch model to 1M context แล้ว /compact | 0.2 ✅ |
| **Coordinator Mode = prompts as architecture** — multi-agent ทำผ่าน system prompt ไม่ใช่ code | document ใน hook-creator: orchestration ทำผ่าน prompt instructions ได้ | 0.7 ✅ |
| **Frustration Detection = regex, not LLM** — ถูกกว่า LLM inference มาก | ใช้ regex-based checks ใน runCommand hooks แทน askAgent เมื่อ logic ง่าย → ประหยัด tokens | 0.11 ✅ |
| **Modular System Prompt: stable top, dynamic bottom** — cache-aware boundaries | ปรับ CLAUDE.md structure: standards/rules อยู่บน, test mapping อยู่ล่าง | 0.5 ✅ / K1 ✅ |
| **KAIROS: 15-second blocking budget** — proactive actions ต้องไม่ block นาน | เพิ่มใน hook prompts: "respond within 15 seconds, skip if analysis takes longer" | 0.11 ✅ |
| **KAIROS: append-only daily logs** — immutable audit trail | memory-palace raw/ folder ใช้ append-only pattern เหมือน KAIROS | 0.8 ✅ |
| **Hook Fork Bomb Prevention** — SessionStart hook spawn process → exponential growth | เพิ่ม Gotcha ใน hook-creator: "hooks ที่ spawn processes ต้องมี guard variable" | 0.7 ✅ |
| **Verification Agent (VERIFICATION_AGENT flag)** — independent adversarial verification | เพิ่ม hook template: verify-on-stop ที่ทำ adversarial review | 0.7 ✅ |
| **TOKEN_BUDGET flag** — explicit token budget targeting ("+500k", "spend 2M tokens") | ใช้แนวคิดนี้กับ tier selection strategy ใน CLAUDE.md/KIRO.md | awareness — |
| **Anti-Distillation: fake tool injection** — ป้องกัน training data extraction | awareness only — รู้ไว้ว่า Claude Code มี defense layer นี้ | awareness — |

### จาก Leaked Source — Prompt & Context Patterns (shloked.com, interviewbrowser.com, sfeir.com)

| Insight | นำมาใช้ยังไง | Task |
|---------|-------------|------|
| **System Prompt = Template Engine** — ไม่ใช่ static doc แต่เป็น compilation ของ sections ที่ conditionally included ตาม ~20 boolean switches | ปรับ CLAUDE.md/KIRO.md: แยกเป็น sections ที่ include/exclude ตาม context (เช่น Playwright section include เฉพาะเมื่อมี test files) | 0.5 ✅ / K2 ✅ |
| **System Reminders (`<system-reminder>`)** — re-inject instructions ที่อยู่ไกลใน context กลับมาตรง tool results | ปรับ hook prompts: ใส่ key rules ซ้ำใน askAgent prompts เพื่อ reinforce instructions ที่อาจหายไปใน long context | 0.10 ✅ |
| **Compression: preserve ALL user messages** — user messages = source of truth, ไม่เคยถูก summarize ออก | ปรับ memory-palace: เมื่อ compress room → closet, preserve user decisions/corrections verbatim | 0.8 ✅ |
| **Analysis Scratchpad Pattern** — `<analysis>` → `<summary>` → strip analysis | ปรับ knowledge-evolution: เมื่อ auto-capture lesson จาก failure, ใช้ analysis→summary→strip pattern | B2 ✅ |
| **Memory Staleness Annotation** — "this memory was written N days ago" | ปรับ memory-palace hall.md: เพิ่ม `@last_updated: YYYY-MM-DD` ต่อท้ายทุก entry, agent ใช้ตัดสินว่า stale หรือไม่ | 0.8 ✅ |
| **Fork = context-aware delegation** — "fork yourself when intermediate output isn't worth keeping" | ปรับ skill isolation hints: skills ที่ produce heavy intermediate output ควร fork | 0.4 ✅ |
| **Output Medium Awareness** — บอก model ว่า output ไปที่ไหน (terminal, IDE, PDF) | เพิ่มใน KIRO.md: "Output renders in Kiro IDE chat panel with markdown support" | K4 ✅ |
| **7-Layer Context Defense** — Tool Result Budget → Snip → Microcompact → Collapse → Auto-Compact → Block → Reactive | awareness: เข้าใจว่า Claude Code จัดการ context overflow ยังไง — ไม่ต้องทำเอง แต่รู้ไว้เพื่อ debug | awareness — |
| **autoDream 4 phases: Orient→Gather→Consolidate→Prune** + MEMORY.md ≤200 lines + lock file ป้องกัน concurrent | ปรับ D2 hook: เพิ่ม lock check + 200-line limit สำหรับ state.md | D2 ✅ |
| **autoDream: relative dates → absolute dates** — "yesterday" → "2026-03-24" | เพิ่มใน memory-palace consolidation: normalize relative dates เป็น absolute | 0.8 ✅ |

### จาก Best Practice Guide (shanraisshan)

| Insight | มาจากไหน | นำมาใช้ยังไง | Task |
|---------|----------|-------------|------|
| **Gotchas section** — highest-signal content, บันทึก failure points | Tips: Skills §4 | เพิ่ม `## Gotchas` ใน SKILL.md ทุกตัวที่เคยมีปัญหา | 0.2 ✅ |
| **CLAUDE.md < 200 บรรทัด** | Tips: CLAUDE.md §1 | split CLAUDE.md ออกเป็น `.claude/rules/` files | 0.5 ✅ |
| **Description = trigger, not summary** | Tips: Skills §5 | rewrite descriptions ที่ยังเป็น summary | 0.1 ✅ |
| **Don't railroad — goals + constraints, not step-by-step** | Tips: Skills §7 | review SKILL.md body ที่ prescriptive เกินไป | 0.3 ✅ |
| **`!command` injection** — embed shell output ใน SKILL.md | Tips: Skills §9 | ใช้กับ finance skills (inject current date, portfolio path) | 0.3 ✅ |
| **PostToolUse hook for auto-format** | Tips: Hooks §3 | เพิ่ม format hook template | 0.7 ✅ |
| **Stop hook to verify work** | Tips: Hooks §5 | เพิ่ม verification hook template | 0.7 ✅ |
| **Measure skill usage with PreToolUse hook** | Tips: Hooks §2 | เพิ่ม skill-usage-tracker hook template | 0.7 ✅ |

---

---

## Phase 0 (NEW) — Skill Quality: ปรับ SKILL.md ตาม Claude Code Internals
**Goal:** ปรับ skill files ให้ตรงกับวิธีที่ Claude Code จริงๆ ใช้ skills — trigger ดีขึ้น, โครงสร้างดีขึ้น
**ไม่กระทบ Phase A-D เดิม ทำก่อนหรือคู่กันได้**

### 0.1 Rewrite SKILL.md descriptions เป็น trigger-style ✅ DONE

**ทำไม:** จาก source, Claude Code ใช้ `description` field ตัดสินว่าจะ fire skill หรือไม่
จาก best practice: "description is a trigger, not a summary — write it for the model"

**ปรับ SKILL.md เหล่านี้:**

| Skill | ปัญหาปัจจุบัน | ปรับเป็น |
|-------|-------------|---------|
| `ai-dlc/SKILL.md` | description เป็น summary ("Root skill for...") | เพิ่ม trigger phrases: "when starting any AI-DLC task", "resolve skill paths", "which skill should I use" |
| `system/memory-palace/SKILL.md` | description เป็น summary ("Organizes project knowledge...") | เพิ่ม: "save memory", "load context", "compress room", "archive wing", "session start", "session end" |
| `system/analysis-concept/SKILL.md` | ดีอยู่แล้ว — มี trigger phrases | ✅ ไม่ต้องปรับ |
| `system/ai-techniques/SKILL.md` | ดีอยู่แล้ว — มี trigger phrases | ✅ ไม่ต้องปรับ |
| `system/skill-creator/SKILL.md` | ดีอยู่แล้ว | ✅ ไม่ต้องปรับ |
| `system/hook-creator/SKILL.md` | ดีอยู่แล้ว — มี Thai + English triggers | ✅ ไม่ต้องปรับ |
| `system/knowledge-evolution/SKILL.md` | ดีอยู่แล้ว — มี trigger phrases ครบ | ✅ ไม่ต้องปรับ |

**วิธีเขียน description ที่ดี (จาก Claude Code source + best practice):**
```yaml
description: >
  This skill should be used when the user asks to "phrase 1", "phrase 2",
  "phrase 3", or needs [what it provides].
```
- ใช้ third-person: "This skill should be used when..."
- ใส่ phrases ที่ user จะพิมพ์จริงๆ
- lean slightly "pushy" — Claude tends to under-trigger

### 0.2 เพิ่ม Gotchas section ใน SKILL.md สำคัญ ✅ DONE

**ทำไม:** จาก best practice: "build a Gotchas section in every skill — highest-signal content, add Claude's failure points over time"

**เพิ่มใน SKILL.md เหล่านี้ (เฉพาะตัวที่เคยมีปัญหาจริง):**

```markdown
## ⚠️ Gotchas

- [failure point ที่เคยเจอ — เพิ่มทีละข้อจากประสบการณ์จริง]
```

Skills ที่ควรมี Gotchas:
- `ai-dlc/qa/playwright-testing/SKILL.md` — เคยมีปัญหา waitForTimeout, selector ผิด
- `ai-dlc/qa/playwright-rules/SKILL.md` — เคยมีปัญหา Gemini ไม่ follow rules
- `ai-dlc/core/aidlc/SKILL.md` — เคยมีปัญหา phase skip
- `system/memory-palace/SKILL.md` — เคยมีปัญหา room >80 lines ไม่ compress
- `ai-dlc/dev/frontend-dev/SKILL.md` — เคยมีปัญหา Gemini introduce bugs

**กฎ:** เริ่มจาก section ว่าง แล้วเพิ่มทีละข้อจากประสบการณ์จริง — ไม่ต้องเดา

### 0.3 ตรวจ Progressive Disclosure — ย้าย content หนักไป references/ ✅ DONE

**ทำไม:** จาก Claude Code source, skill system ทำ 3 ระดับ:
1. **Metadata** (name + description) — always in context (~100 words)
2. **SKILL.md body** — loaded when skill triggers (<500 lines ideal, <2000 words)
3. **references/** — loaded on demand (unlimited)

**ตรวจ SKILL.md ที่อาจยาวเกินไป:**
- ถ้า SKILL.md body > 2,000 words → ย้าย detailed content ไป references/
- ถ้า references/ file > 300 lines → เพิ่ม table of contents

### 0.4 เพิ่ม concurrency + isolation hints ✅ DONE

**ทำไม:** จาก Claude Code source, ทุก tool ประกาศ `isConcurrencySafe()` และ `isReadOnly()`
Skills ก็ควรบอก agent ว่า safe to run parallel หรือไม่

**เพิ่มใน SKILL.md frontmatter (optional field):**
```yaml
---
name: skill-name
description: >
  ...trigger phrases...
concurrency: safe          # safe | unsafe (default: unsafe)
isolation: shared           # shared | fork (default: shared)
---
```

Skills ที่ควรเป็น `concurrency: safe` (read-only, ไม่ write files):
- `system/analysis-concept` — read + think only
- `system/ai-techniques` — read + think only
- `ai-dlc/core/analysis-skills` — read + analyze only

Skills ที่ควรเป็น `isolation: fork` (heavy, ไม่ควรเห็น intermediate steps):
- `ai-dlc/qa/playwright-testing` — รัน tests, output เยอะ
- `ai-dlc/qa/robotframework-testing` — รัน tests, output เยอะ
- `ai-dlc/qa/postman` — migration workflow ยาว

### 0.5 Split CLAUDE.md ให้สั้นลง ✅ DONE

**ทำไม:** จาก best practice: "CLAUDE.md should target under 200 lines per file"
ปัจจุบัน CLAUDE.md ~250+ บรรทัด

**แผน:**
1. ย้าย "Test Coverage Rules" (§7) → `.claude/rules/test-coverage.md`
2. ย้าย "Playwright Skills" (§6) → `.claude/rules/playwright-standards.md`
3. ย้าย "Claude Code Optimization Tips" (§8) → `.claude/rules/optimization.md`
4. เหลือ CLAUDE.md เฉพาะ: Agent Selection (§1-2), Workflow (§3), Token Control (§4), Engineering Standards (§5)

### 0.6 Document Built-in Skills ใน SKILLS_README.md ✅ DONE

**ทำไม:** จาก Claude Code source มี bundled skills 16 ตัว — หลายตัวทำสิ่งที่ไม่ต้องสร้าง custom skill

**เพิ่ม section ใน SKILLS_README.md:**
```markdown
## 5. Built-in Skills (Claude Code)

Skills ที่มาพร้อม Claude Code — ไม่ต้องสร้างเอง:

| Skill | ใช้เมื่อ | เทียบกับ custom skill |
|-------|---------|---------------------|
| `/simplify` | refactor code ให้ clean | — |
| `/verify` | ตรวจ correctness | เสริม qa-architect |
| `/stuck` | ติดปัญหา ไม่รู้จะทำยังไง | — |
| `/remember` | persist ข้อมูลลง memory | เสริม memory-palace |
| `/skillify` | สร้าง skill ใหม่จาก workflow | เสริม skill-creator |
| `/debug` | debugging workflow | — |
| `/batch` | batch operations across files | — |
```

### 0.7 เพิ่ม Hook Templates ใหม่ (จาก best practice + deep analysis) ✅ DONE

**ทำไม:** จาก best practice + leaked source มี hook patterns ที่ยังไม่มีใน templates/

**เพิ่มใน `system/hook-creator/templates/kiro/`:**

| Hook | File | Purpose | Source |
|------|------|---------|--------|
| auto-format after write | `auto-format-on-write.kiro.hook` | PostToolUse(write) → run formatter | best practice |
| verify work on stop | `verify-on-stop.kiro.hook` | agentStop → adversarial review ก่อนจบ session | VERIFICATION_AGENT flag |
| skill usage tracker | `skill-usage-tracker.kiro.hook` | PreToolUse → log which skills fire | best practice |

**เพิ่ม Gotcha ใน hook-creator SKILL.md:**
- "hooks ที่ spawn processes ต้องมี guard variable ป้องกัน fork bomb" (จาก community incident — SessionStart hook ที่ spawn 2 instances → exponential growth)

### 0.8 ปรับ Memory Palace: Skeptical Memory + Append-Only Logs ✅ DONE

**ทำไม:** จาก leaked source, Claude Code ใช้ "skeptical memory" — recalled facts เป็นแค่ hints ต้อง verify ก่อน act
และ KAIROS ใช้ append-only daily logs เป็น immutable audit trail

**ปรับใน `system/memory-palace/SKILL.md` หรือ `references/scaling-protocol.md`:**

```markdown
## Skeptical Memory (จาก Claude Code 3-Layer Memory)

On session start when loading hall.md / closets:
- Treat loaded content as **hints**, not **facts**
- Before acting on recalled information:
  1. Verify against actual files (grep/glob)
  2. If file changed since last session → update memory, use current file
  3. If file matches memory → proceed with confidence
- Log: "🔍 Verified: {fact} — still accurate" or "⚠️ Stale: {fact} — updated from source"

## Append-Only Raw Logs (จาก KAIROS daily logs)

raw/ folder ใช้ append-only pattern:
- ไม่แก้ไข raw files ที่สร้างแล้ว
- เพิ่มได้อย่างเดียว (append new entries)
- ใช้ format: YYYY-MM-DD-{desc}.md
- Consolidation อ่านจาก raw → สรุปเข้า rooms → ไม่ลบ raw
```

### 0.9 เพิ่ม Prompt Cache Rules ใน CLAUDE.md ✅ DONE

**ทำไม:** จาก leaked source, prompt cache มี 14 break vectors + sticky latches
เปลี่ยน CLAUDE.md mid-session = cache หายตลอด session ไม่กลับมา

**เพิ่มใน CLAUDE.md §4 (Token Cost Control):**

```markdown
### Prompt Cache Protection

- ห้ามแก้ CLAUDE.md, .claude/rules/, MCP config ระหว่าง session
- ตั้งค่าทุกอย่างก่อนเริ่ม session — แก้ระหว่างทาง = cache หายถาวร
- ถ้าต้องแก้จริงๆ → /clear แล้วเริ่ม session ใหม่
- CLAUDE.md structure: stable content (standards, rules) อยู่บน, dynamic content (test mapping) อยู่ล่าง
```

**ปรับ CLAUDE.md structure ตาม cache-aware boundaries:**
- ส่วนบน (cached): Agent Selection, Engineering Standards, Token Control
- ส่วนล่าง (dynamic): Test Mapping, Playwright Skills (เปลี่ยนบ่อยกว่า)

### 0.10 เพิ่ม LLM-Friendly Comments Standard ใน Dev Skills ✅ DONE

**ทำไม:** จาก leaked source, Anthropic เขียน code comments สำหรับ AI agents อ่าน ไม่ใช่แค่คน
ผลลัพธ์: AI แก้โค้ดได้ถูกต้องกว่าเพราะเข้าใจ intent ของแต่ละ function

**ปรับใน `ai-dlc/dev/frontend-dev/SKILL.md` และ `ai-dlc/dev/backend-dev/SKILL.md`:**

```markdown
## LLM-Friendly Code Comments (จาก Claude Code Internals)

เขียน comments ที่ AI agents อ่านแล้วเข้าใจ intent — ไม่ใช่แค่คนอ่าน:

❌ แบบเดิม (สำหรับคนอ่าน):
// validate input

✅ แบบใหม่ (สำหรับ AI + คน):
// Validates user input against business rules before saving to DB.
// If validation fails, returns structured error with field-level messages.
// Called by: handleSubmit() in FormComponent.

หลักการ:
- บอก **what** + **why** + **who calls** — ไม่ใช่แค่ what
- ใส่ context ที่ AI ต้องรู้เพื่อแก้โค้ดได้ถูก (dependencies, side effects, constraints)
- Function signatures: เพิ่ม JSDoc/TSDoc ที่อธิบาย params + return + throws
- Complex logic: เพิ่ม comment block ก่อน section อธิบาย business rule
```

**เพิ่มใน `ai-dlc/qa/playwright-rules/` ด้วย:**
- Test files: comment อธิบาย test intent + preconditions ที่ AI ต้องรู้เพื่อ maintain tests

### 0.11 ปรับ Hook Prompts: Time Budget + Regex-First ✅ DONE

**ทำไม:** จาก leaked source:
- KAIROS มี 15-second blocking budget — proactive actions ต้องไม่ block developer นาน
- Frustration detection ใช้ regex ไม่ใช่ LLM — ถูกกว่ามาก

**ปรับ hook prompts ที่ใช้ askAgent:**
- เพิ่ม: "Complete analysis within 15 seconds. If analysis requires more time, skip and report 'skipped — too complex for inline check'"
- Document ใน hook-creator: "ใช้ runCommand + regex สำหรับ checks ง่ายๆ (file exists, pattern match) แทน askAgent → ประหยัด tokens"

**ตัวอย่าง: เปลี่ยน askAgent → runCommand เมื่อ logic ง่าย:**
```json
// ❌ แพง: askAgent ทุกครั้ง
{ "type": "askAgent", "prompt": "Check if test file exists for this source file" }

// ✅ ถูก: runCommand + regex
{ "type": "runCommand", "command": "test -f tests/${FILE%.ts}.spec.ts && echo 'exists' || echo 'missing'" }
```

---

## Phase K (NEW) — Kiro-Specific: รองรับ Kiro IDE
**Goal:** ทำให้ plan รองรับ Kiro ครบ — hooks, steering, specs, KIRO.md parity กับ CLAUDE.md
**ทำได้อิสระจาก Phase A-D และ Phase 0**

### K1. KIRO.md — Prompt Cache Protection ✅ DONE

**ทำไม:** Task 0.9 เพิ่ม Prompt Cache Protection ใน CLAUDE.md แล้ว แต่ KIRO.md ยังขาด
Kiro ก็มี context caching เหมือนกัน — แก้ KIRO.md mid-session = cache หาย

**เพิ่มใน KIRO.md §7 (Token / Cost Control):**

```markdown
### Prompt Cache Protection

- ห้ามแก้ KIRO.md, `.kiro/steering/`, MCP config ระหว่าง session — cache หายถาวร
- ตั้งค่าทุกอย่างก่อนเริ่ม session — แก้ระหว่างทาง = cache lost
- ถ้าต้องแก้จริงๆ → เริ่ม session ใหม่
- KIRO.md structure: stable content (standards, rules) อยู่บน, dynamic content อยู่ล่าง
- Output renders in Kiro IDE chat panel with markdown support
```

### K2. Kiro Steering Files — สร้าง steering สำหรับ AI-DLC workflow ✅ DONE

**ทำไม:** Kiro มี `.kiro/steering/*.md` — ต่างจาก Claude Code ที่ใช้ CLAUDE.md อย่างเดียว
Steering files ใน Kiro ถูก inject เข้า context อัตโนมัติ (inclusion: auto) หรือ on-demand (inclusion: manual)
ปัจจุบันยังไม่มี steering files สำหรับ AI-DLC workflow ใน Kiro projects

**สร้าง steering templates ใน `system/hook-creator/` หรือ `system/skill-creator/`:**

| File | Inclusion | Purpose |
|------|-----------|---------|
| `ai-dlc-standards.md` | `auto` | inject AI-DLC engineering standards ทุก session |
| `playwright-standards.md` | `fileMatch: **/*.spec.ts` | inject playwright rules เฉพาะเมื่อมี test files |
| `knowledge-routing.md` | `manual` | load เมื่อต้องการ knowledge routing context |

**Front-matter format:**
```markdown
---
inclusion: auto
---
# AI-DLC Standards
...
```

**เพิ่มใน hook-creator SKILL.md — Kiro Steering section:**
```markdown
## Kiro Steering Files

Location: `{project}/.kiro/steering/*.md`

| Inclusion | When loaded |
|-----------|------------|
| `auto` | ทุก session — ใช้สำหรับ standards ที่ต้องการเสมอ |
| `fileMatch: pattern` | เมื่อ file ที่ match pattern ถูก read เข้า context |
| `manual` | เมื่อ user reference ด้วย `#` ใน chat |

กฎ: steering files ควรสั้น (<200 lines) — ยาวเกินไป = inject ทุก session = เปลือง tokens
```

### K3. Kiro Spec Integration — เพิ่ม spec-aware hooks ✅ DONE

**ทำไม:** Kiro มี Spec system (`.kiro/specs/`) ที่ Claude Code ไม่มี
มี events `preTaskExecution` และ `postTaskExecution` ที่ trigger ตาม spec task lifecycle
ปัจจุบัน hook templates ยังไม่ใช้ events เหล่านี้

**เพิ่ม hook templates ใน `system/hook-creator/templates/kiro/`:**

| Hook | File | Event | Purpose |
|------|------|-------|---------|
| spec-task-guard | `spec-task-guard.kiro.hook` | `preTaskExecution` | check prerequisites ก่อน task เริ่ม |
| spec-task-test | `spec-task-test.kiro.hook` | `postTaskExecution` | รัน tests หลัง task complete |

```json
// spec-task-guard.kiro.hook
{
  "name": "Spec Task Guard",
  "version": "1.0.0",
  "description": "Check prerequisites before a spec task starts",
  "when": { "type": "preTaskExecution" },
  "then": {
    "type": "askAgent",
    "prompt": "Before starting this spec task: verify that all prerequisite tasks are marked complete in the spec. If any prerequisite is incomplete, report which tasks must be done first and do NOT proceed. Complete this check within 15 seconds."
  }
}
```

```json
// spec-task-test.kiro.hook
{
  "name": "Spec Task Test Runner",
  "version": "1.0.0",
  "description": "Run relevant tests after a spec task completes",
  "when": { "type": "postTaskExecution" },
  "then": {
    "type": "runCommand",
    "command": "ls tests/**/*.spec.ts 2>/dev/null | head -1 && npm test -- --run || echo 'no tests found'"
  }
}
```

**เพิ่มใน hook-creator SKILL.md — Standard Hook Set table:**
- เพิ่ม row: `spec-task-guard | preTaskExecution | — | check prerequisites ก่อน spec task`
- เพิ่ม row: `spec-task-test | postTaskExecution | — | รัน tests หลัง spec task complete`

### K4. KIRO.md — Output Medium Awareness ✅ DONE

**ทำไม:** จาก leaked source insight "Output Medium Awareness" — บอก model ว่า output ไปที่ไหน
Kiro render output ใน IDE chat panel ที่รองรับ markdown — ต่างจาก Claude Code ที่ render ใน terminal

**เพิ่มใน KIRO.md §4 (Engineering Standards) หรือ header:**
```markdown
> **Output Medium:** Kiro IDE chat panel — markdown renders fully.
> Use headers, tables, code blocks freely. Avoid ANSI escape codes.
```

### K5. Kiro Hook — Standard Set ปรับให้ครบ ✅ DONE

**ทำไม:** hook-creator SKILL.md มี Standard Hook Set 6 ตัว แต่ยังขาด:
- `knowledge-score-update` — ยังไม่อยู่ใน Standard Set table
- `memory-palace-auto-consolidation` — ยังไม่อยู่ใน Standard Set table
- spec-task hooks (K3) — ใหม่

**ปรับ Standard Hook Set table ใน hook-creator SKILL.md:**

| # | Hook | Kiro Event | Purpose |
|---|------|-----------|---------|
| 1 | memory-load | `agentStart` | โหลด context ตอนเริ่ม session |
| 2 | aidlc-phase-guard | `preToolUse` (write) | check prerequisites ก่อน write |
| 3 | run-tests-after-write | `postToolUse` (write) | รัน test หลัง AI write |
| 4 | sync-steering-on-skill-add | `fileCreated` | sync steering เมื่อเพิ่ม skill |
| 5 | sync-hook-to-templates | `fileEdited` | sync hook ไป templates |
| 6 | knowledge-score-update | `postToolUse` (shell) | update utility scores หลัง test run |
| 7 | memory-palace-auto-consolidation | `agentStop` | auto-consolidate เมื่อถึง threshold |
| 8 | memory-save | `agentStop` | บันทึก memory ท้ายสุด (always last) |

---

## Phase A — Foundation: Add Quality Signals
**Goal:** Add fields only. No behavior change. Safe to do immediately.

### A1. automation/api/apiIndex.json ✅ DONE
Add to each template entry:
```json
"utility_score": 5.0,
"usage_count": 0,
"last_used": null,
"last_failure": null,
"auto_captured": false
```
Templates: apiauth, apifile, apivalidation, apiutils

### A2. automation/webUi/webUiIndex.json ✅ DONE
Same fields as A1.
Templates: webUiAuth, webUiDialog, webUiFile, webUiForm, webUiNavigation, webUiTable, webUiCard, webUiDrawer, webUiAppLauncher

### A3. automation/mobile/mobileIndex.json ✅ DONE
Same fields as A1.
Templates: mobileAppLaunch, mobileAuth, mobileGestures, mobilePermissions, mobileDeepLink, mobileApiSetup, mobileBiometrics

### A4. lessons/api/* — all lesson json files ✅ DONE
Enriched all lesson files with full schema: `context`, `tags`, `severity`, `code` arrays, `antipattern.why_bad`, `ai_instruction`, `related_lessons`.
`effectiveness` + `auto_captured` live in index files only (single source of truth — not in lesson files).
Files: apiLesAuth, apiLesData, apiLesFile, apiLesMockStrategy, apiLesNetwork, apiLesSetup, apiLesValidation

### A5. lessons/webUi/* — all lesson json files ✅ DONE
Same enriched schema as A4.
Files: webUiLesFile, webUiLesLocator, webUiLesLocators, webUiLesTiming, webUiLesVisibility

### A6. lessons/mobile/mobileLessonsIndex.json ✅ DONE
Mobile lessons converted from .md → .json with enriched schema.
Index populated with lessons array + path + effectiveness fields.
Entries: L-MOB-001, L-MOB-002, L-MOB-003, L-MOB-004

### A7. business/businessIndex.json ✅ DONE
Added `intent_patterns` alongside existing `keywords` per domain.
Added `usage: { usage_count, last_used }` to all 4 domain index files (auth, common, document, finance).

---

## Phase B — Activate: Update Workflow Files
**Goal:** Make workflows score-aware. Requires Phase A complete.

### B1. dev/storage/references/automation-save.md ✅ DONE
Add after existing save steps:

```markdown
## Score Update (after saving lesson)

After saving lesson, update score in index file:
- Test PASS → template.utility_score += 0.5, usage_count += 1, last_used = today
- Test FAIL → template.utility_score -= 1.0, last_failure = today
- New auto-captured lesson → confidence: 0.75, auto_captured: true

Conflict check before save:
1. Load existing index
2. Same id + same content → skip (increment applied_count)
3. Same id + different content → create -v2 entry
4. Contradicting → flag for human review, do NOT save
5. Log: "✅ Knowledge updated: {id} score {before}→{after}"
```

Also update Lesson Schema to include effectiveness fields.

### B2. core/aidlc/references/knowledge-buffer.md ✅ DONE
Add Post-Execution Reflect section after Phase 3.2:

```markdown
### Post-Execution Reflect (Phase 3.2)

After test execution completes:
1. PASS → update template utility_score (+0.5), usage_count (+1), last_used = today
2. FAIL → update template utility_score (-1.0), last_failure = today
3. Extract failure pattern → check for duplicate in lessons/
4. New pattern → auto-capture lesson (confidence: 0.75, auto_captured: true)
5. Log: "✅ Knowledge Buffer updated"
```

Add enhanced Reuse Check at Phase 1.2:

```markdown
### Reuse Check (Phase 1.2 — score-aware)

1. Scan lessons/ for relevant domain
2. Filter: still_relevant = true
3. Sort: effectiveness.prevented_failures DESC, then applied_count DESC
4. Surface top 3 most effective lessons
5. Report: "📚 Top lessons: {lesson_id} (prevented {n}x failures)"
```

### B3. core/aidlc/references/qa-task-design.md ✅ DONE
Update Process Step 2 "Read Lessons Learnt":

```markdown
2. Read Lessons Learnt (score-aware):
   - Load {knowledge_root}/lessons/{platform}/ index
   - Filter: still_relevant = true
   - Sort: effectiveness.prevented_failures DESC, then applied_count DESC
   - Surface top 3 most effective lessons first
   - Note confidence for auto_captured lessons
   - Skip lessons where still_relevant = false
```

### B4. core/aidlc/references/dev-task-design.md ✅ DONE
Same update as B3 for Step 2.

### B5. core/analysis-skills/references/discovery-domain.md ✅ DONE
Update Phase 4 — add intent matching before keyword fallback:

```markdown
### Phase 4.0 (NEW): Extract Intent
"What is the Input → Process → Output of this feature?"

### Phase 4.1 (NEW): Intent Match
Compare extracted intent against intent_patterns in businessIndex.json
Match = pattern overlap ≥ 2 steps → load domain, proceed to Phase 5
If no match → continue to Phase 4.2 (keyword, original behavior)
```

Update Phase 5 — add utility-weighted selection:

```markdown
### Phase 5 (updated): Utility-Weighted Selection
When multiple templates match:
1. Sort by utility_score DESC
2. Select top match
3. If top score < 3.0 → warn: "⚠️ Template มีปัญหาบ่อย — review ก่อนใช้"
4. If auto_captured = true AND confidence < 0.8 → note: "📝 Auto-captured — ยังไม่ verified"
```

### B6. dev/storage/references/buffer-update.md ✅ DONE
Add at end of process:

```markdown
## Score Sync (final step)

If Memory Palace knowledge-evolution wing exists:
→ Read template-health.md and lesson-effectiveness.md
→ Apply score changes to index files
→ Log: "✅ Score sync complete"
```

---

## Phase C — Memory: Connect Memory Palace
**Goal:** Cross-session tracking. Requires Phase B complete.

### C1. Create knowledge-evolution wing template ✅ DONE
Template structure (from `system/knowledge-evolution/references/memory-integration.md` §1-2):
```
.memory/wings/knowledge-evolution/
├── hall.md
├── rooms/
│   ├── template-health.md
│   ├── lesson-effectiveness.md
│   ├── gap-tracker.md
│   └── routing-log.md
└── closets/
    └── knowledge-state.md
```

### C2. core/memory-palace/SKILL.md ✅ DONE
Add Knowledge Tracking section:
```markdown
## Knowledge Tracking

On session start:
- Load knowledge-evolution/hall.md if exists
- Brief: top template score, top lesson effectiveness, flags, gaps

On session end:
- Update knowledge-evolution wing with score changes
- Sync back to index files
- Tunnel: knowledge-evolution ↔ active project wing
```

### C3. system/memory-palace/references/scaling-protocol.md ✅ DONE
Auto-Consolidation section added (default=auto, 7 steps, human verify).

---

## Phase D — Automate: Hooks
**Goal:** No manual triggers. Requires Phase C complete.

### D1. Hook: post-test score update ✅ DONE
File: `system/hook-creator/templates/kiro/knowledge-score-update.kiro.hook`
```json
{
  "name": "Knowledge Score Update",
  "version": "1.0.0",
  "when": { "type": "postToolUse", "toolTypes": ["shell"] },
  "then": {
    "type": "askAgent",
    "prompt": "If the last shell command ran tests, check the result and update utility scores in the relevant knowledge index files. If tests passed, increment utility_score +0.5 and usage_count for templates used. If tests failed due to a template issue, decrement utility_score -1.0 and set last_failure to today. Use knowledge-evolution/references/utility-scoring.md for the protocol."
  }
}
```

### D2. Hook: memory palace auto-consolidation ✅ DONE

**Inspired by:** Claude Code Dream System (`src/services/autoDream/`)
Dream System ทำ Orient→Gather→Consolidate→Prune เป็น background loop
เราปรับเป็น agentStop hook ที่ทำ consolidation เมื่อถึง threshold

File: `system/hook-creator/templates/kiro/memory-palace-auto-consolidation.kiro.hook`
```json
{
  "name": "Memory Palace Auto-Consolidation",
  "version": "1.0.0",
  "when": { "type": "agentStop" },
  "then": {
    "type": "askAgent",
    "prompt": "Check if Memory Palace consolidation is needed: read state.md and check Consolidation_Stats.sessions_since. If mode=auto (default) AND (sessions_since >= 5 OR days_since >= 7), run Auto-Consolidation steps from memory-palace/references/scaling-protocol.md §Auto-Consolidation. Update Consolidation_Stats after completion. Show summary to user for verification."
  }
}
```

---

## Status Summary
<!-- last verified: 2026-04-14 | Priority order: A → B → C → D → Phase 0 → Phase K -->

### Additional work done (beyond original plan)

**Lesson schema enrichment (all platforms):**
- All lesson files (api, webUi, mobile) upgraded to enriched schema: `context`, `tags`, `code` arrays, `antipattern.why_bad`, `ai_instruction`, `related_lessons`
- `effectiveness` + `auto_captured` removed from lesson files → now lives in index files only (single source of truth)

**Index files:**
- `apiLessonsIndex.json` — populated `lessons` array with all 16 lessons + path + effectiveness
- `webUiLessonsIndex.json` — populated `lessons` array with all 11 lessons + path + effectiveness
- `mobileLessonsIndex.json` — already had lessons array, confirmed complete
- `automationIndex.json` — fixed stale paths (`ai-agent/knowledge/...` → `knowledge/...`), updated counts
- `apiIndex.json` — fixed stale lessonsIndex path, updated lessons_count to 16

**Business domain index files:**
- All 4 domain indexes (auth, common, document, finance) — added `usage: { usage_count: 0, last_used: null }`

| Priority | Phase | Task | Status |
|----------|-------|------|--------|
| 🔴 NOW | A | apiIndex.json utility fields | ✅ DONE |
| 🔴 NOW | A | webUiIndex.json utility fields | ✅ DONE |
| 🔴 NOW | A | mobileIndex.json utility fields | ✅ DONE |
| 🔴 NOW | A | api lesson files effectiveness fields | ✅ DONE |
| 🔴 NOW | A | webUi lesson files effectiveness fields | ✅ DONE |
| 🔴 NOW | A | mobileLessonsIndex.json effectiveness fields | ✅ DONE |
| 🔴 NOW | A | businessIndex.json intent_patterns | ✅ DONE |
| 🟠 NEXT | B | automation-save.md score update | ✅ DONE |
| 🟠 NEXT | B | knowledge-buffer.md reflect protocol | ✅ DONE |
| 🟠 NEXT | B | qa-task-design.md lesson sorting | ✅ DONE |
| 🟠 NEXT | B | dev-task-design.md lesson sorting | ✅ DONE |
| 🟠 NEXT | B | discovery-domain.md intent + utility routing | ✅ DONE |
| 🟠 NEXT | B | buffer-update.md score sync | ✅ DONE |
| 🟡 THEN | C | knowledge-evolution wing template | ✅ DONE |
| 🟡 THEN | C | core/memory-palace/SKILL.md | ✅ DONE |
| 🟡 THEN | C | scaling-protocol.md auto-consolidation | ✅ DONE |
| 🟡 THEN | D | knowledge-score-update hook | ✅ DONE |
| 🟡 THEN | D | memory-palace-auto-consolidation hook | ✅ DONE |
| 🟢 AFTER | 0 | 0.1 Rewrite SKILL.md descriptions (trigger-style) | ✅ DONE |
| 🟢 AFTER | 0 | 0.2 เพิ่ม Gotchas section ใน SKILL.md สำคัญ | ✅ DONE |
| 🟢 AFTER | 0 | 0.3 ตรวจ Progressive Disclosure | ✅ DONE |
| 🟢 AFTER | 0 | 0.4 เพิ่ม concurrency + isolation hints | ✅ DONE |
| 🟢 AFTER | 0 | 0.5 Split CLAUDE.md ให้สั้นลง + cache-aware structure | ✅ DONE |
| 🟢 AFTER | 0 | 0.6 Document Built-in Skills | ✅ DONE |
| 🟢 AFTER | 0 | 0.7 เพิ่ม Hook Templates ใหม่ + fork bomb gotcha | ✅ DONE |
| 🟢 AFTER | 0 | 0.8 Memory Palace: Skeptical Memory + Append-Only Logs | ✅ DONE |
| 🟢 AFTER | 0 | 0.9 Prompt Cache Rules ใน CLAUDE.md | ✅ DONE |
| 🟢 AFTER | 0 | 0.10 LLM-Friendly Comments Standard ใน Dev Skills | ✅ DONE |
| 🟢 AFTER | 0 | 0.11 Hook Prompts: Time Budget + Regex-First | ✅ DONE |
| 🟢 AFTER | 0 | 0.12 Edit Path | ✅ DONE |
| 🟢 AFTER | K | K1. KIRO.md Prompt Cache Protection | ✅ DONE |
| 🟢 AFTER | K | K2. Kiro Steering Files templates | ✅ DONE |
| 🟢 AFTER | K | K3. Kiro Spec Integration hooks | ✅ DONE |
| 🟢 AFTER | K | K4. KIRO.md Output Medium Awareness | ✅ DONE |
| 🟢 AFTER | K | K5. Standard Hook Set ปรับให้ครบ | ✅ DONE |

**Done:** 35/35 tasks
**Remaining:** 0/35 tasks

---

## Ongoing Tasks (ทำต่อเนื่อง — ไม่มี done state)

### 🔁 เพิ่ม Gotchas จากประสบการณ์จริง

→ **Auto** via `gotcha-capture.kiro.hook` — เมื่อ shell command fail ด้วย pattern ที่ agent รู้จัก hook จะ suggest Gotcha ให้ confirm แล้วเพิ่มอัตโนมัติ

Template: `system/hook-creator/templates/kiro/gotcha-capture.kiro.hook`

### 🔁 Review Auto-Captured Lessons (confidence < 0.8)

→ **Auto** via `lesson-review.kiro.hook` — ทุก session end hook จะตรวจ index files หา auto-captured lessons ที่ยังไม่ review แล้ว prompt ให้ Keep / Edit / Delete

Template: `system/hook-creator/templates/kiro/lesson-review.kiro.hook`

### 🔁 TOKEN_BUDGET Pattern (จาก leaked source)

Claude Code มี TOKEN_BUDGET flag — explicit token budget targeting เช่น "+500k", "spend 2M tokens"

**นำมาใช้ใน tier selection:** เมื่อ task ใหญ่มาก ให้ระบุ budget ชัดเจนใน prompt:
- "ใช้ไม่เกิน 50K tokens สำหรับ task นี้" → agent จะ scope งานให้พอดี
- "spend up to 200K — ทำให้ละเอียด" → agent จะ deep dive

เพิ่มใน CLAUDE.md/KIRO.md §4 เมื่อต้องการ (optional — ใช้เมื่อ task ใหญ่และ cost สำคัญ)

---

## Execution Order (แบ่งตามความเร่งด่วน)
Sprint 1 🔴 — Phase A (7 tasks, add fields)
Sprint 2 🟠 — Phase B (6 tasks, activate scoring)  
Sprint 3 🟡 — Phase C-D (4 tasks, memory + hooks)
Sprint 4 🟢 — Phase 0 (11 tasks, skill quality)
Sprint 5 🟢 — Edit path ai-agent/knowledge to {project_root}/skills/knowledge
Sprint 6 🟢 — Phase K (5 tasks, Kiro-specific)
Sprint 7 🔵 — Insights Traceability (ongoing — update Task column ใน Insights tables เมื่อ implement แต่ละ item)

---

## Reference Files

| Need | File |
|------|------|
| Scoring schema + update protocol | `system/knowledge-evolution/references/utility-scoring.md` |
| Intent patterns + routing upgrade | `system/knowledge-evolution/references/smart-routing.md` |
| Memory wing structure + session sync | `system/knowledge-evolution/references/memory-integration.md` |
| Auto-consolidation protocol | `system/knowledge-evolution/references/auto-consolidation.md` |
| Full concept guide | `system/knowledge-evolution/KNOWLEDGE_EVOLUTION_README.md` |
| Hook schema (Kiro) | `system/hook-creator/references/kiro-hook-schema.md` |
| Hook schema (Claude Code) | `system/hook-creator/references/claude-code-hook-schema.md` |
| Kiro steering guide | `.kiro/steering/` (project-level) |
| KIRO.md (Kiro agent instructions) | `~/.claude/skills/KIRO.md` |
| Skill writing guide | `system/skill-creator/references/skill-guide.md` |
| Claude Code architecture (leaked) | `https://github.com/codeaashu/claude-code/blob/main/docs/architecture.md` |
| Claude Code skill system (leaked) | `https://github.com/codeaashu/claude-code/blob/main/docs/subsystems.md` |
| Claude Code best practices | `https://github.com/shanraisshan/claude-code-best-practice` |
