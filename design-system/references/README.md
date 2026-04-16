# @design-system Skill

**AI-powered design system generator** that analyzes project requirements and automatically generates complete, tailored design systems.

---

## Quick Start

### 1. Invoke the Skill
```bash
# In Claude Code, type:
@design-system

# Or specify parameters:
@design-system --industry fintech --stack react
```

### 2. Provide Project Context
- **Industry**: Tech, Finance, Healthcare, E-commerce, Services, Creative, Lifestyle, Emerging Tech
- **Tech Stack**: React, Next.js, Vue, Svelte, Flutter, SwiftUI, etc.
- **Target Users**: Developers, designers, product teams

### 3. Get Your Design System
Output includes:
- **Reasoning Engine**: 4-stage analysis (search, match, generate, validate)
- **Pattern Recommendations**: Layout, navigation, components, interactions
- **Color Palette**: Primary, secondary, semantic colors with dark mode
- **Typography**: Fonts, scale, weights, accessibility specs
- **Animation Effects**: Transitions, timings, easing functions
- **Accessibility Checklist**: WCAG AA validation, responsive breakpoints

---

## Features

| Feature | Count | Benefit |
|---------|-------|---------|
| **Industry Rules** | 161 | Domain-specific, battle-tested patterns |
| **UI Styles** | 67 | Visual approaches (minimalism, brutalism, etc.) |
| **Color Palettes** | 161 | Psychology-backed, industry-aligned colors |
| **Font Pairings** | 57 | Google Fonts combinations, accessibility-tested |
| **Chart Types** | 25 | Data visualization for dashboards |
| **UX Guidelines** | 99 | Detailed, interactive patterns |
| **Tech Stacks** | 15 | Web, mobile, native platforms |

---

## Directory Structure

```
@design-system/
├── SKILL.md                           ← Skill entry point
├── README.md                          ← You are here
├── reasoning-engine/
│   └── four-stage-process.md          ← How the engine works
├── industry-rules/
│   ├── README.md                      ← Overview of 161 rules
│   ├── tech-saas.md                   ← 20 rules for SaaS
│   ├── finance.md                     ← 21 rules for finance
│   ├── healthcare.md                  ← 20 rules for healthcare
│   ├── ecommerce.md                   ← 20 rules for e-commerce
│   ├── services.md                    ← (Create as needed)
│   ├── creative.md                    ← (Create as needed)
│   ├── lifestyle.md                   ← (Create as needed)
│   └── emerging-tech.md               ← (Create as needed)
├── design-patterns/
│   ├── overview.md                    ← 67 styles, 161 palettes, 57 fonts, 25 charts, 99 guidelines
│   ├── colors-index.md                ← Quick color reference
│   ├── typography.md                  ← (Create as needed)
│   └── components.md                  ← (Create as needed)
├── tech-stacks.md                     ← 15 platforms, output format
└── references/
    ├── wcag-checklist.md              ← (Create as needed)
    └── accessibility.md               ← (Create as needed)
```

---

## Core Capabilities

### Reasoning Engine (4 Stages)

1. **Multi-Domain Search**
   - Category analysis (SaaS, fintech, etc.)
   - Style preferences (minimalism, bold, etc.)
   - Color psychology
   - UI pattern matching
   - Typography fit

2. **Intelligent Matching**
   - Apply 161 industry-specific rules
   - BM25 ranking (relevance algorithm)
   - Filter anti-patterns
   - Validate coherence

3. **Complete Output**
   - Pattern recommendations
   - Color system (semantic colors, dark mode)
   - Typography scale
   - Animation effects
   - Design token generation

4. **Quality Validation**
   - WCAG AA accessibility check
   - Responsive breakpoint verification
   - Contrast ratio validation
   - Mobile & desktop optimization

---

## Usage Examples

### Example 1: Fintech Startup
```
Industry: Finance
Stack: React + Tailwind
Tone: Professional, accessible

Output:
✓ Navy + Green color palette (trust + growth)
✓ Table layouts for transactions
✓ 2FA pattern for security
✓ Clear financial microcopy
✓ WCAG AAA compliance
✓ Dark mode support
✓ Tailwind config with design tokens
```

### Example 2: Healthcare Platform
```
Industry: Healthcare
Stack: Next.js
Tone: Empathetic, clear

Output:
✓ Soft blue + green palette
✓ Timeline for patient journey
✓ Medication instructions pattern
✓ Appointment booking flow
✓ Privacy disclaimers
✓ Accessible typography (16px+)
✓ HIPAA-friendly data visualization
```

### Example 3: E-commerce Shop
```
Industry: E-commerce
Stack: Vue + Vite
Tone: Energetic, trustworthy

Output:
✓ Orange CTA + blue trust
✓ Product grid with filters
✓ Multi-step checkout
✓ Customer reviews pattern
✓ Abandoned cart recovery
✓ Fast performance specs
✓ Mobile-optimized layout
```

---

## Integration with Other Skills

### Call from `ui-designer`
```
ui-designer: Create a login form
→ Calls @design-system for color palette & typography
→ Generates form following industry rules
```

### Generate Design Tokens
```
@design-system → Output CSS custom properties / Tailwind config
→ Paste into project: tailwind.config.js or :root {}
```

### Validate Existing Design
```
@design-system --validate --file="current-design.html"
→ WCAG AA report + responsive feedback
```

---

## File Organization

### By Industry (161 Rules Total)
- `tech-saas.md` - 20 rules
- `finance.md` - 21 rules
- `healthcare.md` - 20 rules
- `ecommerce.md` - 20 rules
- `services.md` - 20 rules (TBD)
- `creative.md` - 20 rules (TBD)
- `lifestyle.md` - 20 rules (TBD)
- `emerging-tech.md` - 20 rules (TBD)

### By Design Asset
- `design-patterns/overview.md` - Comprehensive library
- `design-patterns/colors-index.md` - 161 palettes quick ref
- `tech-stacks.md` - Platform-specific guidance

### By Process
- `reasoning-engine/four-stage-process.md` - How recommendations are generated

---

## Next Steps (Remaining Rules)

To complete the skill, create:
1. `industry-rules/services.md` (20 rules)
2. `industry-rules/creative.md` (20 rules)
3. `industry-rules/lifestyle.md` (20 rules)
4. `industry-rules/emerging-tech.md` (20 rules)
5. `design-patterns/typography.md` (font pairing index)
6. `design-patterns/components.md` (UI component patterns)
7. `references/wcag-checklist.md` (accessibility audit)

---

## Model Capability

**Haiku can handle**: Structural work, rule organization, documentation ✅

**Sonnet recommended for**: If you need to enhance the reasoning engine with more sophisticated analysis, AI-powered recommendations, or fine-tuning the matching algorithm.

---

*Last Updated: 2026-04-16*
*Status: Core structure complete; 4/8 industry rule files created*
