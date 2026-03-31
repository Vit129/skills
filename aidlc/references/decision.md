# Decision-Plan-Execute

Structured decision-making with mandatory user approval at every phase.

## When to use
- Before any AIDLC phase that requires user decisions
- When creating structured deliverables
- When governance and traceability are required

## Process

1. **Create Decision File** — present options with recommendations, NEVER fill answers
2. **Wait for user** — user fills in decision answers
3. **Create Plan File** — task breakdown based on resolved decisions
4. **Wait for approval** — user must explicitly approve ("yes", "proceed", "approved")
5. **Execute Plan** — implement tasks, update checkboxes every 3-5 tasks
6. **Update Audit Trail** — record phase completion, deliverables, decisions

## Rules
- DECISIONS FIRST — always create decision file before planning
- NEVER fill decision answers — leave blank for user
- STOP after plan — never auto-execute without approval
- Update plan checkboxes incrementally during execution
- Update audit.md at every phase completion

## Approval patterns

| User says | Action |
|-----------|--------|
| "yes", "proceed", "approved", "ได้", "โอเค", "อนุมัติ", "ตกลง", "เอา" | Continue |
| "1", "A", "B", "เลือก A", "เอา B" | Use selected option |
| "yes but...", "ได้ แต่...", "โอเค แต่..." | Address condition first |
| "no", "wait", "ไม่", "รอก่อน", "ยังไม่", "แก้ก่อน" | Stop and clarify |
