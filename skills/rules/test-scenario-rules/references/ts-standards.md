# Test Scenario - Design Guidelines

Rules for writing high-quality Test Scenarios (Title, Pre-conditions, Steps, Expected Result, Priority).

## 1. Test Scenario Categories

- **Success Cases (Happy Path):** Normal system behavior. Starts with `[Success]`.
- **Failure Cases (Negative Scenarios):** Error handling logic. Starts with `[Alternative]`.
- **Security Cases:** Auth bypass, permission violations, injection, token abuse. Starts with `[Security]`.
- **Boundary Scenarios:** Testing data limits (Min/Max).
- **Edge Scenarios:** Special situations (Null, Empty, Special Chars).

Combine similar Boundary/Edge/Failure cases where appropriate.
**Security cases are ALWAYS separate** — never combine with functional cases.

## 2. Title Writing

**Format:** `[TestType][Prefix] + Verb + Object + Context`

**TestType:** `[UI]`, `[Mobile]`, `[Tablet]`, `[API]`
**Prefix:** `[Success]`, `[Alternative]`, `[Security]`

**Recommended Verbs:**
- UI: แสดง, เปิด, กรอก, เลือก, ใช้งาน, เข้าสู่ระบบ
- API Success: ส่งคำขอ, รับข้อมูล, สร้าง, อัปเดต, ลบ
- API Alternative: จัดการข้อผิดพลาดเมื่อ...

**Forbidden:** ❌ "ทดสอบ", "ตรวจสอบ" in Title. ❌ Start with a Noun.

**Examples:**
- ✅ `[UI][Success] แสดงหน้าแก้ไขข้อมูลสำหรับลูกค้าประเภทสินเชื่อ`
- ✅ `[API][Alternative] จัดการข้อผิดพลาดเมื่อ Login ไม่สำเร็จ`
- ❌ `[Success] แสดงหน้า Login` (ขาด TestType)

## 3. Test Scenario Structure

- **Brief Description:** Optional — only for complex scenarios or referencing a Requirement ID.
- **Pre_conditions:** Mandatory — User Role, Data Setup, Page State.
- **Test Steps with test data:** Mandatory — step-by-step with `<br>` line breaks.
- **Expected test result:** Mandatory — must align with Test Steps.
- **Actual test result:** Empty (filled after execution).

## 4. Test Type & Automation Status

**Test_type:** API, Mobile UI, Web UI, WindowsApp UI, Other
**Automation status:** Automated, Automatable, Cannot automate
**Test result:** Not start (default), Passed, Failed, Invalid case

## 5. Default Values

⚠️ **Updated for CSV V2:**

- **Test result:** `Not start`
- **Actual test result:** Empty
- **Automation test status:** `Automatable`
- **Cannot automate reason:** Empty

## 5.1 Sprint Tag & Assigned To — Ask at Start

⚠️ **MANDATORY — Ask BEFORE writing any TS (2 questions, one at a time):**
⛔ **HARD GATE:** If these 2 values are not resolved → STOP. Do NOT write test-scenarios.md or CSV.

**Step 0 — PBI Assigned To (auto-fetch, no user input needed):**
- Read `agent-memory/user-profile.md` § QA Work Context → `Dev Email` field
- If has value → use it for col 20 of PBI row in CSV
- If placeholder/missing → fetch from project management tool:
  - ADO: `System.AssignedTo.uniqueName` via MCP `wit_get_work_item`
  - Jira: issue assignee field
- If fetch fails → ask user: "PBI Assigned To email คืออะไรครับ?" → save back to `user-profile.md` § QA Work Context → `Dev Email`

**Step 0.5 — File & Folder Naming (set BEFORE creating any file):**
- MD filename: `testScenarioPbi{PBI_ID}.md` (e.g. `testScenarioPbi275957.md`)
- Folder name: `pbi-{PBI_ID}-{feature-kebab}` (e.g. `pbi-275957-document-status-reason`)
- PBI ID field in MD header: `**PBI-ID:** {PBI_ID}` (e.g. `**PBI-ID:** 275957`)
- ⚠️ `md2csv.sh` parses PBI ID from filename regex `testScenario(\d+)` — wrong name = empty ID in CSV

**Step 1 — Sprint number:**
- Auto-derive YYYY from current date (e.g. `new Date().getFullYear()` → `2026`)
- Ask user only for sprint number via `userInput`:
  ```
  Sprint number คือเท่าไหร่ครับ? (default จาก context เช่น 52)
  → tag จะเป็น: 2026SP52
  ```
- Combine into tag: `${YYYY}SP${sprintNumber}` → e.g. `2026SP52`

**Step 2 — Assigned To (QA executor):**
- Check `projects.json` for `qaEmail` field under the current project/team first
- If found → use it directly, show: `"QA Assigned To: {email} (จาก projects.json)"`
- If NOT found → ask user via `userInput`:
  ```
  Assigned To (QA email) สำหรับ TS ชุดนี้คืออะไรครับ? (เว้นว่างได้)
  ```
  Then **save the email to `projects.json`** under the current project/team as `qaEmail` immediately
- This is the QA who will execute the TS (col 20) — not the PBI owner

**After both confirmed:**
- Save both values to session context
- Apply to ALL TS in this session: tag → col 19, assigned to → col 20
- Do NOT ask again during export

## 6. Complete User Flow Coverage

Login/Auth → Navigation → Action → Confirmation → Result.
Test: Cross-Page Navigation, Modals/Pop-ups, State Changes.

## 7. Paired Test Scenario Design (API + UI)

**⚠️ CRITICAL RULE:** AI agents MUST **design in pairs** (API + UI) for functions that can be tested both ways, then **let the User decide** which one to keep.

**Reason:**
- AI doesn't know the team's resource allocation for API vs. UI testing.
- AI doesn't know the project's specific testing strategy (API-heavy vs. E2E).
- Users understand the business context better.

### 7.1 Principles of Paired Design

Separate scenarios into two items:
- `[API][Success/Alternative]` — Tests Backend logic.
- `[UI][Success/Alternative]` — Tests Frontend + User interaction.

**Design pairs for:** Login/Auth, CRUD operations, Form/Order submissions, Search/Filter, Export/Download, Data validation.

**Single only:**
- UI-only: Animation, Responsive, Visual styling, Modal behavior.
- API-only: Batch processing, Scheduled jobs, Background tasks.

**⚠️ Paired = separate files, NOT same file:**
- Design API + UI scenarios as pairs → present both to user → user decides which platform(s) to keep
- Store in **separate files per platform**: `testScenarioPbi{ID}-api.md` and `testScenarioPbi{ID}-web-ui.md`
- **Security scenarios ALWAYS in separate file**: `testScenarioPbi{ID}-security.md` (covers all platforms)
- Never mix `Test_type: API` and `Test_type: Web UI` in the same MD file — causes CSV import issues in Azure DevOps
- Never mix `[Security]` scenarios with functional `[Success]`/`[Alternative]` — different review cycle, different pipeline

### 7.2 Language Policy

1. **Title:** ภาษาไทย + Prefix `[TestType][Prefix]` เสมอ
2. **Brief Description:** ภาษาไทย (ถ้ามี)
3. **Pre-conditions:** ภาษาไทย
4. **Test Steps:** ภาษาไทย (คำทับศัพท์เทคนิคได้ เช่น คลิก, กรอก, Submit)
5. **Expected Result:** ภาษาไทย
6. **Technical Guidelines:** (ส่วนกฎเกณฑ์ในไฟล์นี้) ภาษาอังกฤษได้เพื่อความกระชับเชิงเทคนิค

## 8. Language Policy

1. Title: ภาษาไทย + Prefix `[TestType][Prefix]`
2. Brief Description: ภาษาไทย
3. Pre-conditions: ภาษาไทย
4. Test Steps: ภาษาไทย (คำทับศัพท์เทคนิคได้)
5. Expected Result: ภาษาไทย

## 9. Priority Levels

### Critical

**Definition:** The problem will block progress

**Use when:** When this test scenario fails, it must be fixed **"immediately"** because QA cannot continue testing.

**⚠️ Business Priority Rule:** If it involves a **Core Business Function** that directly impacts revenue or security → **Must be Critical**.

**Examples:** Login/Authentication, Payment Gateway, Submit Order, Upload important files, Money Transfer (Financial Transactions), Account Balance Check, Transaction Confirmation

**Automation Rule:** ✅ Critical and High must be automated.

---

### High

**Definition:** Serious problem that could block progress

**Use when:** When this test scenario fails, it must be fixed in **"this Sprint"**. QA can still continue testing but it is difficult.

**⚠️ Business Priority Rule:** If it involves an **Important Business Function** that affects customer experience or credibility → **Must be High**.

**Note:** Branding errors fall under this priority.

**Examples:** Edit Order, Approve/Reject workflow, Export report, Notification email, Transaction History, Account Statement, Transfer Limit Check, OTP Verification

**Automation Rule:** ✅ Critical and High must be automated.

---

### Medium

**Definition:** Has the potential to affect progress

**Use when:** Should be fixed if there is time left in the Sprint or scheduled for the next Sprint, but must be fixed before going to Production.

**⚠️ Business Priority Rule:** If it involves a **Supporting Business Function** that improves efficiency or convenience → **Medium or higher**.

**Examples:** Manage Profile, Change password, Filter/Search, UI validation (field required), Transaction Search/Filter, Account Settings, Favorite Recipients, Transfer Templates

---

### Low

**Definition:** Minor problem or easy workaround

**Use when:** Fix planning depends on the team, but must be fixed before going to Production.

**⚠️ Business Priority Rule:** If it involves a **Non-Business Function** or **Cosmetic Issue** → **Low**.

**Examples:** Button color does not match design, Alignment, Typo/spelling, Loading Animation, Button Hover Effects, Color Scheme, Font Size/Style

## 10. Automation Requirements

- Critical + High → Must be automated (API + UI)
- Medium → API mandatory, UI optional
- Low → API only

## 11. Test Design Techniques

### When to Apply Each Technique

| Requirement Type | Technique | Coverage Goal |
|---|---|---|
| Single input field with constraints (min/max/length) | EP + BVA | All partitions + boundaries |
| Multi-parameter form/API with 1 happy path | Base-Choice (BC) | 1 base E2E + 1 variation per param |
| Multi-parameter with interactions between params | Multiple-Choice (MC) | Pairwise coverage (use PICT tool) |
| Feature with explicit states (e.g. order lifecycle) | State Transition (ST) | ST-1 minimum, ST-2 for critical |
| Complex state machine (payment, auth) | W-method / Transition Tree | Full path coverage from FSM |

### 11.1 Equivalence Partitioning (EP)

**Rule:** For every input field → identify valid and invalid partitions → write minimum 1 scenario per partition.

**Enforcement:** If a field accepts values → scenario set MUST cover:
- At least 1 valid partition value
- At least 1 invalid partition value (if applicable)

**Title convention:** Include partition context in title
- ✅ `[API][Alternative] จัดการข้อผิดพลาดเมื่อส่ง amount เป็นค่าลบ`
- ✅ `[UI][Alternative] แสดง error เมื่อกรอก email ผิด format`

### 11.2 Boundary Value Analysis (BVA)

**Rule:** If a field has a numeric/length constraint → boundary tests are **MANDATORY**.

**Enforcement:** For each constraint (min, max, minLength, maxLength):
- Test AT boundary (min, max)
- Test OFF-by-one (min-1, max+1)

**When to skip:** Field has no defined boundary (free text, no limit).

**Title convention:**
- ✅ `[API][Alternative] จัดการข้อผิดพลาดเมื่อ amount = 0 (ต่ำกว่า minimum)`
- ✅ `[UI][Success] แสดงผลสำเร็จเมื่อกรอกชื่อ 100 ตัวอักษร (max boundary)`

### 11.3 Base-Choice Coverage (BC)

**Rule:** For multi-parameter features → design scenarios as:
1. **1 Base test (Happy E2E):** All parameters at their "most typical" valid value → chain into 1 complete flow
2. **N Variation tests:** Change exactly 1 parameter from base → observe impact

**Enforcement:**
- Base test MUST be the first scenario in the set, titled with `[Base]` tag
- Each variation changes exactly ONE parameter from base
- Total scenarios = 1 + (number of variable parameters)

**Title convention:**
- ✅ `[API][Success][Base] สร้าง order สำเร็จด้วยค่า default ทั้งหมด`
- ✅ `[API][Success][Variation] สร้าง order สำเร็จเมื่อเปลี่ยน paymentMethod เป็น credit card`
- ✅ `[UI][Alternative][Variation] แสดง error เมื่อเปลี่ยน quantity เป็น 0`

**Why this is efficient:** Covers all test conditions with minimum scenarios. Maps perfectly to 1 E2E test + parameterized variations.

### 11.4 Multiple-Choice Coverage (MC)

**Rule:** Use ONLY when parameters have known interactions (parameter A affects behavior of parameter B).

**Enforcement:**
- Generate combination matrix using PICT or AllPairs tool (OUTSIDE the scenario design)
- Each row in matrix = 1 test scenario
- Title includes `[Combo]` tag

**When to use:** 4+ parameters with suspected interactions.
**When NOT to use:** Independent parameters → use Base-Choice instead (cheaper).

**Title convention:**
- ✅ `[API][Success][Combo] สร้าง order: paymentMethod=credit + deliveryType=express + coupon=applied`

### 11.5 State Transition (ST)

**Coverage levels:**

| Level | What it covers | When to use |
|---|---|---|
| ST-0 | All states exist | Always (implicit in any state test) |
| ST-1 | Every valid single transition | Default minimum for stateful features |
| ST-2 | Every valid pair of transitions | Critical state machines (order, payment) |
| ST-3+ | N-switch coverage | Only when explicitly required |
| Invalid transitions | Events that should be rejected in a given state | Always for Critical priority |

**Enforcement:**
- If AC mentions state changes → draw state model FIRST (in planning docs)
- Minimum coverage = ST-1 (all valid transitions) + invalid transitions for Critical
- Each transition path = 1 test scenario

**Title convention:**
- ✅ `[API][Success][State] เปลี่ยนสถานะ order จาก pending → confirmed`
- ✅ `[API][Alternative][State] ปฏิเสธการเปลี่ยนสถานะจาก cancelled → confirmed (invalid transition)`

**State model requirement:** Before writing ST scenarios, a state diagram must exist in `.aidlc/planning/` showing:
- All states (nodes)
- All valid transitions (edges) with trigger events
- Invalid transitions to test

### 11.6 Chow W-method / Transition Tree

**Rule:** Use ONLY for complex critical state machines where ST-2 is insufficient.

**When to apply:**
- Payment processing flows
- Authentication/session lifecycle
- Multi-step approval workflows with 5+ states

**Enforcement:**
- Requires a formal FSM diagram with: states, alphabet (events), transition function, initial state
- Generate transition tree via BFS from initial state
- Each leaf-to-root path = 1 test scenario
- Title includes `[W-method]` tag

**Title convention:**
- ✅ `[API][Success][W-method] Verify path: initial → pending → processing → completed`

**When NOT to use:** Simple 3-4 state flows → use ST-1/ST-2 instead (cheaper).

### 11.7 Technique Selection Decision Tree

```
Is the feature stateful (has explicit states)?
├── YES → How many states?
│   ├── ≤ 4 states → ST-1 + invalid transitions
│   ├── 5-8 states + Critical priority → ST-2
│   └── 8+ states + Critical → W-method / Transition Tree
└── NO → How many input parameters?
    ├── 1 parameter → EP + BVA
    ├── 2-3 parameters → Base-Choice (BC)
    └── 4+ parameters with interactions → Multiple-Choice (MC)

Does the feature involve auth, permissions, or user input?
└── YES → ALWAYS add [Security] scenarios (in addition to above)
```

### 11.8 Security Testing

> **Full rules in dedicated skill:** `rules/security/SKILL.md`
> Load when Pre-flight Q5 = Yes (security concern) or feature has auth/permission/user input.

**Quick summary:**
- `[Security]` prefix — separate file: `testScenarioPbi{ID}-security.md`
- OWASP-based test conditions (auth bypass, IDOR, injection, XSS, rate limit)
- Permission matrix pattern for multi-role features
- Priority: Critical or High only
- Tag: `@Security` in automation
