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

- Test result: `Not start`
- Actual test result: Empty
- Automation test status: `Automatable`

## 6. Complete User Flow Coverage

Login/Auth → Navigation → Action → Confirmation → Result.
Test: Cross-Page Navigation, Modals/Pop-ups, State Changes.

## 7. Paired Test Scenario Design (API + UI)

Design both `[API]` and `[UI]` scenarios for features testable both ways. Let user decide which to keep.

**Design pairs for:** Login/Auth, CRUD, Form submissions, Search/Filter, Export/Download, Data validation.
**Single only:** UI-only (Animation, Responsive), API-only (Batch, Scheduled jobs).

## 8. Language Policy

1. Title: ภาษาไทย + Prefix `[TestType][Prefix]`
2. Brief Description: ภาษาไทย
3. Pre-conditions: ภาษาไทย
4. Test Steps: ภาษาไทย (คำทับศัพท์เทคนิคได้)
5. Expected Result: ภาษาไทย

## 9. Priority Levels

| Level | Definition | Examples |
|-------|-----------|----------|
| Critical | Blocks all testing, fix immediately | Login, Payment, Core transactions |
| High | Serious, fix this sprint | Edit Order, Approve workflow, Export |
| Medium | Fix before production | Profile, Search, Filter, Settings |
| Low | Minor/cosmetic | Button color, Alignment, Typo |

## 10. Automation Requirements

- Critical + High → Must be automated (API + UI)
- Medium → API mandatory, UI optional
- Low → API only
