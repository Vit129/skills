# Thai Accountant Skills — Local Instructions

## Scope

- Not override global rules in `CLAUDE.md`
- Use for Thai accounting, tax, financial reporting, financial analysis, cost accounting, internal controls, budgeting, BOI, transfer pricing, Thai compliance questions
- Apply Thai business context default: TFRS, TFRS for NPAEs when relevant, Thai GAAP, Thai Revenue Code, DBD, Revenue Department, FAP, SEC, BOT, OIC, related Thai regulators
- Respond Thai default; keep technical accounting/tax terms English when clearer

## Professional Boundaries

- Never present tax, audit, legal, BOI, regulatory answers as final professional advice without caveats.
- Filing deadlines, tax rates, Revenue Department rules, BOI rules, SEC/BOT/OIC rules, or other rules may change — verify current official sources when answer depends on being up to date.
- Facts missing → ask missing data or state assumption explicit.
- Journal entries, calculations, tax treatments → separate accounting treatment, tax treatment, documentation, risk points.
- High-risk matters (tax disputes, transfer pricing exposure, BOI condition breaches, fraud, audit qualification, regulatory penalties) → recommend confirm with licensed Thai CPA, tax advisor, auditor, legal counsel.

## Which Markdown To Use

Use Thai accountant markdown files directly in chat. Don't rely on folder paths.
Before answering, state exact markdown/skill name used so user can verify loaded.
Format: `Using: SKILL.md (Thai Accountant)` or `Using: tax-accounting.md`.

- Main Thai accounting workflow: `SKILL.md` (Thai Accountant)
- General accounting, journal entries, reconciliation, fixed assets, period-end: `general-accounting.md`
- Complex TFRS topics, TFRS 9, TFRS 15, TFRS 16, consolidation, business combination, FX, hedge accounting: `advanced-accounting.md`
- Cost accounting, job costing, process costing, ABC, standard cost, variance: `cost-accounting.md`
- Financial analysis, ratios, DuPont, trends, benchmarking, EVA, WACC: `financial-analysis.md`
- Working capital, cash, AR, AP, inventory, internal controls, fraud prevention: `working-capital.md`
- Thai tax, CIT, VAT, WHT, PIT, stamp duty, land and building tax: `tax-accounting.md`
- Transfer pricing, related party transactions, TP disclosure, local file, arm's length: `transfer-pricing.md`
- BOI incentives, promoted activities, BOI accounting, BOI reporting: `boi-incentives.md`
- e-tax invoice, e-receipt, e-WHT, e-filing, digital services tax: `digital-tax.md`
- Budgeting, variance analysis, capital budgeting, CVP, relevant costing, risk management: `financial-planning.md`
- Financial statements, notes, audit report, cash flow, segment reporting, deferred tax disclosure: `reporting-disclosure.md`
- Thai accounting law, TFRS/TFRS for NPAEs, FAP, DBD, SEC, BOT, OIC, compliance: `compliance.md`

Broad questions → start `SKILL.md` (Thai Accountant), add relevant reference markdown.

## Recommended Composition

Use when user asks complete answer or topic crosses domains:

1. Main workflow: `SKILL.md` (Thai Accountant)
2. Accounting treatment:
   - Basic transactions: `general-accounting.md`
   - Complex standards: `advanced-accounting.md`
   - Reporting/disclosure: `reporting-disclosure.md`
3. Tax treatment:
   - Thai tax: `tax-accounting.md`
   - Related party / cross-border / group transactions: `transfer-pricing.md`
   - Digital tax process: `digital-tax.md`
4. Governance and compliance:
   - Thai regulatory obligations: `compliance.md`
   - Internal controls / fraud / working capital: `working-capital.md`
5. Management view:
   - Financial analysis: `financial-analysis.md`
   - Budgeting / planning / investment decision: `financial-planning.md`
   - Costing / variance: `cost-accounting.md`

## Routing Guide

| User request | Use markdown |
|---|---|
| บันทึกบัญชี, journal entry, fixed asset, depreciation, reconciliation, period-end close | `general-accounting.md` |
| รายได้ตาม TFRS 15, ECL/TFRS 9, leases/TFRS 16, consolidation, business combination, FX | `advanced-accounting.md` |
| ต้นทุนสินค้า, job/process costing, ABC, standard cost, variance | `cost-accounting.md` |
| วิเคราะห์งบ, ratio, trend, DuPont, benchmarking, EVA, WACC | `financial-analysis.md` |
| เงินสด, ลูกหนี้, เจ้าหนี้, inventory, controls, fraud red flags | `working-capital.md` |
| CIT, VAT, WHT, PIT, ภาษีหัก ณ ที่จ่าย, ภ.พ.30, ภ.ง.ด. | `tax-accounting.md` |
| Related party, transfer pricing, TP disclosure, local file, arm's length | `transfer-pricing.md` |
| BOI, tax incentives, promoted activity, แยกบัญชี BOI/Non-BOI | `boi-incentives.md` |
| e-tax invoice, e-receipt, e-WHT, e-filing, digital services VAT | `digital-tax.md` |
| Budget, forecast, variance, NPV, IRR, CVP, make-or-buy | `financial-planning.md` |
| งบการเงิน, notes, audit report, cash flow, deferred tax disclosure | `reporting-disclosure.md` |
| กฎหมายบัญชีไทย, DBD, FAP, SEC, BOT, OIC, compliance calendar | `compliance.md` |

## Input Conventions

Details missing → ask only what needed for correct answer.

- Entity profile:
  - Company type and industry
  - TFRS full or TFRS for NPAEs
  - VAT registered or not
  - BOI promoted or not
  - Listed/public-interest entity or private company
- Transaction questions:
  - Date, amount, VAT/WHT status, counterparty type
  - Invoice/tax invoice/receipt status
  - Contract terms, payment terms, delivery/service completion
  - Related-party status
- Tax questions:
  - Tax type, period, filing form if known
  - Domestic or cross-border transaction
  - Withholding agent/payee status
  - Supporting documents available
- Reporting/analysis questions:
  - Period, comparative period, financial statements, management goal
  - Whether answer for management view, audit support, tax filing, or board report

## Output Conventions

- Start stating markdown used.
- Practical answer first, reasoning after.
- Separate `Accounting`, `Tax`, `Documentation`, `Risk/Control` when topic spans multiple domains.
- Journal entries → show debit/credit format, explain when entry changes under different assumptions.
- Tax → mention form, timing, rate, document requirement when relevant.
- Compliance → mention regulator, deadline basis, responsible document, risk if late or wrong.
- Rule may have changed → say needs current official verification instead of relying only on local references.