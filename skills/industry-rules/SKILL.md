---
name: industry-rules
description: >
  This skill should be used when the user asks to "check industry design rules",
  "what are the design rules for finance/healthcare/ecommerce/tech/services/creative/lifestyle/emerging tech",
  "design rules for finance/healthcare/ecommerce/tech/services/creative/lifestyle/emerging tech",
  "recommend design patterns for my industry",
  or needs the authoritative industry-specific UX/UI design rules.
  Always activate when designing interfaces for a specific industry sector.
version: 1.1.0
last_improved: 2026-08-07
improvement_count: 1
---

# Industry Rules (161 Total)

`[source:github.com/nextlevelbuilder/ui-ux-pro-max-skill] (MIT)` — structure (Recommended Patterns / Style Priorities / Color Moods / Typography Personality / Key Effects / Anti-Patterns) and initial rule set derived from upstream's per-category reasoning data. Individual rules are expanded well beyond the raw source rows with additional rationale, accessibility notes, and mobile guidance not present in the source data.

Specialized design rules organized by 8 industry sectors.

- **Tech & SaaS** — Productivity, collaboration, data visualization. (Read `references/tech-saas.md`)
- **Finance** — Trust, security, data clarity, regulatory compliance. (Read `references/finance.md`)
- **Healthcare** — Accessibility, empathy, data privacy, patient-centric. (Read `references/healthcare.md`)
- **E-commerce** — Conversion, trust, browsability, checkout simplicity. (Read `references/ecommerce.md`)
- **Services** — Booking flows, provider trust, hospitality warmth vs. professional-services authority. (Read `references/services.md`)
- **Creative** — Portfolio storytelling, immersive media, creation-tool chrome. (Read `references/creative.md`)
- **Lifestyle** — Daily-use habit loops, personal/sensitive data, calm vs. gamified tone. (Read `references/lifestyle.md`)
- **Emerging Tech** — Web3, spatial computing, quantum, robotics, AI/chat, biotech/climate — credibility signaling for unfamiliar tech. (Read `references/emerging-tech.md`)

If a product type doesn't fit cleanly into one of these 8 hand-elaborated categories, `~/.claude/skills/ui-designer/scripts/search.py` (from the sibling `ui-designer` skill) queries the same live upstream engine and CSV databases directly (`--domain product`, `--domain style`, `--domain color`, `--domain typography`, etc. — see its own `--help`). Cross-reference against that broader engine rather than duplicating it here; this skill's files stay hand-elaborated prose for the 8 categories above, the engine in `ui-designer/scripts/` + `ui-designer/data/` is the one shared source of raw/live data.

## Rule Structure

Each industry includes:
- Recommended Patterns
- Style Priorities
- Color Moods
- Typography Personality
- Key Effects
- Anti-Patterns

## Quick Lookup

| File | Rules |
|------|-------|
| `references/tech-saas.md` | 20 rules |
| `references/finance.md` | 21 rules |
| `references/healthcare.md` | 20 rules |
| `references/ecommerce.md` | 20 rules |
| `references/services.md` | 20 rules |
| `references/creative.md` | 20 rules |
| `references/lifestyle.md` | 20 rules |
| `references/emerging-tech.md` | 20 rules |

## Usage

### Single Industry
```
Read: references/finance.md
Apply: All 21 rules to fintech product
```

### Cross-Industry Pattern
```
Combine: references/tech-saas.md + references/finance.md
Apply: To fintech SaaS (startup investing platform)
```

### Anti-Pattern Check
```
Review: references/[industry].md → Anti-Patterns section
Validate: Current design against known pitfalls
```
