# Business Domains Index

Updated: 2026-04-27
Version: 6.0.0 (migrated from JSON)
Total domains: 4

## Reading Protocol

1. วิเคราะห์ PBI/Requirement เพื่อหา Business Domain ที่เกี่ยวข้อง
2. Match keywords ในหน้านี้กับ Domains ด้านล่าง
3. อ่านเฉพาะ domain index หรือ rules ที่เกี่ยวข้องกับงาน

## Domains

| Domain | Type | Description | Index | Keywords | Intent Patterns |
|--------|------|-------------|-------|----------|-----------------|
| auth | core | Authentication & Authorization | business/auth/index.md | login, logout, sso, authentication, เข้าสู่ระบบ | verify identity → grant access; input credentials → validate → create session |
| common | core | Shared UI Logic & Components | business/common/index.md | search, filter, toast, modal, table, form | input query → filter results → display list; select item → validate → confirm |
| document | core | File Upload & Download | business/document/index.md | upload, download, file, attachment | select file → validate format → upload → confirm |
| finance | core | Payment & Invoice Processing | business/finance/index.md | payment, invoice, credit, billing | calculate amount → validate → process transaction |
