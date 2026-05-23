# Test Cases: [Project Name] - Sprint [N]

## Summary
### API Case
| Endpoint | Method | User Story | Test Case | Case |  Automation Status |
|----------|--------|---------|------------|-----|-----|
| [/api/resource] | [GET/POST/etc] | [US-001] | [TC-001] | [Success] | ✅/⚠️/🚫 |
| [/api/resource] | [GET/POST/etc] | [US-001] | [TC-002] | [Validation Error] | ✅/⚠️/🚫 |

### UI Case
| Module | Function | User Story | Test Case | Case | Automation Status |
|--------|--------|---------|------------|-----|-----|
| Checkin | Get Checkin | [US-001] | [TC-003] | [Test flow in short] | ✅/⚠️/🚫 |
| Checkin | Submit checkin | [US-001] | [TC-004] | [Validation Error] | ✅/⚠️/🚫 |


## Test Scenario

### TC-001: [Platform][Module][Function] {{scenario}}
**Azure DevOps ID:** TBD

**User Story:** US-XXX: [User Story Title]
**State:** To Do
**Components:** [Feature]
**Priority Level:** [Critical | High | Medium | Low]
**Test Application:** [API | Mobile UI | Web UI | WindowsApp UI | Other]
**Automation Status:** [Cannot automate | Automated | Automatable]
**Effort:** [0.5 | 1.0 | 1.5 | 2.0]
**Test Scenario by AI:** Yes

---

**Brief Description:**
[Clear summary of what this test validates]

**Pre-conditions:**
- [e.g., User logged in with admin role]
- [e.g., Test database contains sample data]
- [e.g., API endpoint is accessible]

**Test Steps:**
*For UI Tests:*
1. Navigate to [page/URL]
2. Enter [field]: "[test data]"
3. Click [button]

*For API Tests:*
1. Prepare: [test data setup]
2. Call: [HTTP Method] [endpoint]
   - Headers: {"key": "value"}
   - Body: {"field": "value"}

**Expected Result:**
- [Specific, measurable outcome, expected behavior]
- [For API: HTTP status code + response body]
- [For UI: Visible changes or messages]


## Related Test Scenario
### API Case
| Endpoint | Method | Original User Story | Original Test Case | New Test Case | Case |  Reason |
|----------|--------|---------|------------|-----|-----|
| [/api/resource] | [GET/POST/etc] | [US-001] | [TC-001] | [TC-007] | [Success] | Obsoleted API |
| [/api/resource] | [GET/POST/etc] | [US-001] | [TC-002] | [TC-008] | [Validation Error] | Expected result changed |


### UI Case
| Module | Function | Original User Story | Original Test Case | New Test Case | Case | Automation Status |
|--------|--------|---------|------------|-----|-----|
| Checkin | Get checkin | [US-001] | [TC-003] | [TC-010] | [Test flow in short] | Need regression |
| Checkin | Submit checkin | [US-001] | [TC-004] | [TC-011] | [Validation Error] | Have updated error dialog |

### Suggestion Case
| Platform | Endpoint | Function | Missing Case Description | Priority Level |
|----------|--------|--------|--------------------------|----------------|
| [API] | [GET/POST/etc] [/api/resource] | [Create] | Duplicate email | Critical |
| [MOBILE] | - | [Update profile with invalid data] | Field validation error | Medium |

### Obsoleted Case
| Initial Test Case ID | New Test Case ID | Reason for Obsolescence | Current Sprint PBI |
|----------------------|------------------|------------------------|--------------------|
| TC-001 | TC-007 | API endpoint deprecated | US-005 |


---

## Examples

### Positive Cases (Happy Path)
- `[API][Login][Authenticate] Login success with valid credentials`
- `[WEB][User][Create] Create user with all required fields`

### Negative Cases (Error Handling)
- `[API][Login][Authenticate] Login fails with invalid password`
- `[API][Login][Authenticate] Login fails with expired token`
- `[WEB][User][Create] Create user fails with missing required field`
- `[API][User][Update] Update fails with unauthorized access`

### Boundary Cases
- `[API][User][Create] Create user with username at minimum length (3 chars)`
- `[API][User][Create] Create user with username at maximum length (50 chars)`
- `[API][User][Create] Create user fails with username below minimum (2 chars)`

## Priority Levels

### Priority Level Values:
- **Critical**
- **High**
- **Medium**
- **Low**

### Priority Descriptions:

#### Critical – The problem will block progress
**คำอธิบาย:** เมื่อ Test scenario นี้ไม่ผ่านต้องแก้ไข "ทันที" เพราะ QA ไม่สามารถทดสอบต่อได้

**ตัวอย่าง:**
- Login/Authentication
- Payment Gateway
- Submit Order
- Upload file สำคัญ เช่น สัญญา Vendor

#### High – Serious problem that could block progress
**คำอธิบาย:** เมื่อ Test scenario นี้ไม่ผ่านเพราะฟังก์ชันที่ทดสอบทำงานผิดพลาดต้องแก้ไขใน "Sprint นี้" QA ยังทดสอบต่อได้แต่ยุ่งยาก
- ข้อผิดพลาดเกี่ยวกับ Branding จะอยู่ใน Priority นี้

**ตัวอย่าง:**
- Edit Order
- Approve/Reject workflow
- Export report
- Notification email


#### Medium – Has the potential to affect progress
**คำอธิบาย:** เมื่อ Test scenario นี้ไม่ผ่าน ควรแก้ไขถ้ามีเวลาเหลือใน Sprint หรือจัดลงใน Sprint ถัดไป แต่ต้องแก้ไขก่อนขึ้น Production และ QA ยังทดสอบต่อได้

**ตัวอย่าง:**
- Manage Profile
- Change password
- Filter / Search
- UI validation (field required)

#### Low – Minor problem or easily worked around
**คำอธิบาย:** เมื่อ Test scenario นี้ไม่ผ่าน การวางแผนแก้ไขจะขึ้นอยู่กับทีมงาน แต่ต้องแก้ไขก่อนขึ้น Production
- ปัญหา Cosmetic issues จะอยู่ใน Priority นี้

**ตัวอย่าง:**
- Visual, UI
- สีปุ่มไม่ตรงแบบ
- Alignment
- Typo, spelling

## Field Guidelines

### Test Application (Test_type)
**ค่าที่เป็นไปได้:**
- **API** - API Testing
- **Mobile UI** - Mobile Application Testing
- **Web UI** - Web Application Testing
- **WindowsApp UI** - Windows Desktop Application Testing
- **Other** - การทดสอบประเภทอื่นๆ เช่น Application log, Database, Performance

### Automation Status
- **API:** Default "Automatable"
- **Web UI:** Default "Automatable" if priority level = Critical or High, otherwise "Cannot automate"
- **Mobile UI:** Default "Automatable" if priority level = Critical or High, otherwise "Cannot automate"
- **WindowsApp UI:** Default "Automatable" if priority level = Critical or High, otherwise "Cannot automate"
- **Other:** Default "Cannot automate" (ระบุเหตุผลใน Cannot automate reason)
- **Automated:** Script already exists

### Test Result
**ค่าที่เป็นไปได้:**
- **Not start** - (Default) ยังไม่ได้เริ่มทดสอบ
- **Passed** - ทดสอบผ่าน ผลลัพธ์ตรงตาม Expected result
- **Failed** - ทดสอบไม่ผ่าน ผลลัพธ์ไม่ตรงตาม Expected result
- **Invalid case** - Test case ไม่ถูกต้องหรือไม่สามารถทดสอบได้

### Effort & Remaining Work

Applies to ALL platforms: API, Web UI, Mobile UI

| Level | Effort | Examples |
|-------|--------|---------|
| **Simple** | 1 hr | Single endpoint, 1-2 assertions, no DB, no auth |
| **Standard** | 1.5–2 hr | Multi-step flow, schema validation, basic auth, form submit |
| **Complex** | 2–3 hr | Multi-page flow, DB verify, edge cases, mock setup |
| **Full** | 3–5 hr | E2E flow (search→book→pay→confirm), multi-service, stateful |

- Unit = hour
- **Remaining Work** = **Effort** for new cases
- Use midpoint when unsure (e.g., Standard → 2 hr)

---

## Checklist

- [ ] Title follows naming convention: `[Platform][Module][Function] {{scenario}}`
- [ ] Area Path and Iteration Path match related PBI
- [ ] Test steps include specific test data
- [ ] Expected results are clear and measurable
- [ ] API tests specify HTTP method, headers, body, and expected status
- [ ] Priority level set based on definition
- [ ] Automation Status matches Test Application type
- [ ] Effort set per complexity scale (Simple=1, Standard=1.5-2, Complex=2-3, Full=3-5)
- [ ] Linked to User Story
- [ ] Written in English