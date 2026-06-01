# Common Business Rules

---
domain: common
updated: 2026-04-27
---

## Business Logic Rules

| ID | Name | Tags | Validations |
|----|------|------|-------------|
| BL001 | Date Validation | common, validation, date | date_format_valid, date_not_in_past, date_within_range |
| BL002 | Required Field Validation | common, validation, form | field_not_empty, field_meets_format |
| BL003 | Authentication | common, auth, login | credentials_required, session_valid, token_not_expired |
| BL004 | Language Switch | common, language, i18n | language_supported, content_translated |
| BL005 | Error Handling | common, error, validation | error_message_displayed, http_status_correct |
| BL006 | Session Management | common, session, timeout | session_timeout_valid, auto_logout_on_timeout |

## Web UI Actions

| ID | Name | Tags | Steps |
|----|------|------|-------|
| UA001 | Search | search, webui | Locate input → Clear → Enter term → Trigger → Wait → Verify results |
| UA002 | Filter | filter, webui | Open panel → Select criteria → Apply → Wait → Verify filtered |
| UA003 | Pagination | pagination, webui | Verify controls → Click next/prev → Wait → Verify page number |
| UA004 | Toast/Alert | toast, alert, webui | Wait appear → Verify message → Verify type → Wait disappear |
| UA005 | Modal/Dialog | modal, dialog, webui | Wait appear → Verify content → Click action → Verify closed |
| UA006 | Breadcrumb | breadcrumb, navigation, webui | Verify visible → Verify path → Click item → Verify navigated |
| UA007 | Dropdown | dropdown, select, webui | Click open → Wait options → Select → Verify selection |
| UA008 | Table Actions | table, sort, webui | Verify loaded → Click header sort → Select rows → Verify state |
| UA009 | Form Actions | form, submit, webui | Fill fields → Validate required → Submit → Verify result |
| UA010 | Login | auth, login, webui | Navigate → Enter username → Enter password → Click login → Verify |
| UA011 | Logout | auth, logout, webui | Click user menu → Click logout → Verify redirect → Verify session cleared |
| UA012 | Change Language | language, i18n, webui | Click selector → Select language → Verify translated → Verify saved |
