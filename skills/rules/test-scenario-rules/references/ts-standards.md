# Test Scenario - Design Guidelines

Rules for writing high-quality Test Scenarios (Title, Pre-conditions, Steps, Expected Result, Priority).

## 1. Test Scenario Categories

- **Success Cases (Happy Path):** Normal system behavior. Starts with `[Success]`.
- **Failure Cases (Negative Scenarios):** Error handling logic. Starts with `[Alternative]`.
- **Boundary Scenarios:** Testing data limits (Min/Max).
- **Edge Scenarios:** Special situations (Null, Empty, Special Chars).

Combine similar Boundary/Edge/Failure cases where appropriate.

## 2. Title Writing

**Format:** `[TestType][Prefix] + Verb + Object + Context`

**TestType:** `[UI]`, `[Mobile]`, `[Tablet]`, `[API]`
**Prefix:** `[Success]`, `[Alternative]`

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
- If has value → use it for col 20 of PBI row
- If placeholder → fetch from project management tool (ADO: `System.AssignedTo.uniqueName` / Jira: issue assignee)
- If fetch fails → ask user: "PBI Assigned To email คืออะไรครับ?" → save back to user-profile.md

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
- Read `agent-memory/user-profile.md` § QA Work Context → `QA Email` field
- If has value → use it directly, show: `"QA Assigned To: {email} (จาก user-profile.md)"`
- If placeholder → check `projects.json` for `qaEmail` field under the current project/team
- If found in projects.json → use it, save back to user-profile.md
- If NOT found anywhere → ask user via `userInput`:
  ```
  Assigned To (QA email) สำหรับ TS ชุดนี้คืออะไรครับ? (เว้นว่างได้)
  ```
  Then **save the email to `user-profile.md`** § QA Work Context immediately
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
- Never mix `Test_type: API` and `Test_type: Web UI` in the same MD file — causes CSV import issues in Azure DevOps

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
