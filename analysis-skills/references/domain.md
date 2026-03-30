# Domain Analysis

Map business logic across domains and find reusable patterns.

## When to use
- Starting a new feature and want to know if similar logic exists elsewhere
- Need to estimate how much can be reused vs built from scratch
- Cross-domain pattern recognition

## How it works
1. **Abstract the feature** — strip away specifics, find the flow pattern (Input → Process → Output)
2. **Scan all domains** — check every available domain, not just obvious ones
3. **Match by flow, not name** — "hotel room booking" and "meeting room reservation" are the same pattern
4. **Calculate reusability** — count confirmed reusable items / total needed × 100
5. **Assess impact** — what can be reused in design, data, and implementation?
6. **Classify logic** — common (works in any industry) vs specific (needs business context)

## Rules
- Never guess IDs — only cite what's confirmed in actual files
- Never conclude "no match" based on domain name alone — abstract deeper
- Combine best parts from multiple domains ("Lego Assembly") rather than forcing one domain to fit

## Output
```
Abstract Pattern: [Input → Process → Output]
Domain A (XX%): [why similar] — Reusable: [items]
Domain B (XX%): [why similar] — Reusable: [items]
Gap: [new items needed]
Reusability Score: XX%

Impact:
- Design: reuse [items] in pre-conditions
- Data: adapt patterns from [domain]
- New: record [new items] to knowledge base
```
