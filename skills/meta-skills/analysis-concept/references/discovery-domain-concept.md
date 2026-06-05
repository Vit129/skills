# Discovery & Domain Matching Concept

Find what already exists (concrete scan) and match abstract patterns across domains (abstract scan) before creating anything new.

Adapted from: `thinking/analysis-skills/references/discovery-domain.md`

## When to use

- About to create something new in an existing system
- Want to avoid duplicating work that's already been done
- Working on a new feature for an existing system (Incremental Discovery)
- Need to estimate how much can be reused vs built from scratch
- Cross-domain pattern recognition

## Thinking Pattern

Execute all phases sequentially.

### Phase 1: Load Existing Context

- Check if previous analysis or documentation exists for this {system/feature}
- Extract: "Existing Assets", "Architecture", "Patterns Found"
- If nothing exists → new {system/feature} → continue with empty context

### Phase 2: Index Scan (Concrete)

- Determine the category of work you're doing
- Load relevant indexes or catalogs for that category
- Scan for existing {assets}: templates, patterns, lessons learned
- Deep Abstraction Match for lessons:
  1. Identify abstract technical concern of each sub-feature
  2. Analogical Reasoning: "What category handles the same abstract concern?"
  3. Match against ALL available categories
  4. Never conclude "no match" based on category name alone

### Phase 3: Full {Feature} Asset Scan (Concrete)

- Read the ENTIRE {feature} area to understand the full picture
- Check all relevant locations for existing {items}
- If path not found → discover actual structure → update paths and retry
- Deep read: extract names, signatures, existing patterns, internal logic
- Classify (Anti-Redundancy Rule):
  - `reuse` — already does what you need, use as-is
  - `extend` — close enough, add/modify to fit
  - `create` — ONLY if NO existing {item} can be repurposed

### Phase 3.1: Similar {Items} (In-Context Learning)

- Search for {items} with similar keywords or purpose
- Read top 2-3 most relevant matches
- Extract: structure, design patterns, conventions used

### Phase 3.2: Existing Data/Pattern Library

- Search for existing data patterns matching your {system/feature}
- Match by structure similarity, naming patterns
- Extract: structure, rules, relationships, boundary values

### Phase 4: Abstract Domain Matching

- Scan available {domain_indexes} → extract categories, keywords, paths
  - If no index exists → skip Phase 4, set Reusability Score = 0%, continue to Phase 5
- Compare task against ALL available {domains} using Deep Abstraction:
  - Forget {specific_context} — look at flow: Input → Process → Output
  - Never conclude "no match" based on {domain_name} alone
  - If no surface match, abstract deeper until only flow pattern remains
  - Stop condition: generic I/O with no structural similarity → "no match"

#### Deep Abstraction Protocol

```text
"Forget {specific_context}
 Look at Flow: Lookup → Validate → Update
 Find Abstract Level Patterns"
```

#### Step-Back for Domain Matching

```text
"What abstract problem does this solve?
 What is the Input → Process → Output pattern?"
```

#### Analogical Reasoning

```text
"{concept_A} = {abstract_pattern}" (e.g., availability concept)
"{concept_B} = {abstract_pattern}" (e.g., status workflow)
"{concept_C} = {abstract_pattern}" (e.g., state machine)
```

### Phase 4.1: Deep Logic Search

- Apply Deep Abstraction Protocol (remove specific context)
- Analyze: Input → Process → Output pattern
- Search reusable {logic_items} in matching {domains}
- Load {domain_rules} for top matches
  - If rules don't exist → note as "domain identified but no rules yet" — do NOT hallucinate

### Phase 4.2: Common vs Specific Classification

For each {logic_item}, ask 3 questions:

- Q1: Does this work in any domain without modification? → Common
- Q2: Does it need domain context to make sense? → Domain-Specific
- Q3: Is it tied to organization/team-specific rules? → Context-Specific

| Answer | Classification | Example |
|--------|---------------|---------|
| Q1 = Yes | Common | Auth, CRUD, pagination, file handling |
| Q2 = Yes | Domain-Specific | Domain calculations, workflow rules |
| Q3 = Yes | Context-Specific | Custom approval flows, internal formulas |

### Phase 5: Template/Pattern Matching

- Analyze existing {assets} (Phase 3) + architecture pattern + requirements
- Match {templates/patterns} ONLY for parts classified as "create"
- Filter: keep only matching items

### Phase 5.1: Gap Analysis (from Discovery)

- Compare required vs available {assets} (from Phase 3 + Phase 4)
- Identify missing {items} with estimated effort
- Prioritize: Critical > High > Medium > Low

### Phase 5.2: Logic Extraction

- From matched {domains} (Phase 4), extract:
  - Validation rules
  - Constraints
  - Format requirements
  - Workflow logic
- If no rules found → continue to Phase 6

### Phase 6: Reusability Score & Knowledge Buffer

**Reusability Score:**

- Formula: (confirmed reuse + extend items from Phase 3 + confirmed reusable logic from Phase 4) / total required × 100
- Only count items confirmed from actual content — never estimate
- 🟢 >80% | 🟡 60-80% | 🔴 <60%

**Impact Assessment:**

- Design Impact: what can be reused
- Data Impact: what patterns can be adapted
- Implementation Impact: what new logic needs to be created
- Formulate "Lego Assembly" Strategy: combine best parts from multiple {domains}

**Knowledge Buffer Capture:**

- Identify new patterns NOT in existing {assets}
- "Reusable 2+ features" = abstract concern appears in ≥2 distinct sub-features or is cross-cutting
- Determine strategy: Reuse / Adapt / Create

## Output Pattern

Write complete Discovery & Domain Analysis output to the appropriate location for your domain.

```text
## Discovery & Domain Analysis

### Existing {Assets}
- [N] {assets} found (reuse/extend/create classification)
- {Templates/Patterns} Found: [N] matched
- Lessons Learned: [N] applicable
- Similar {Items}: [N] found
- Data/Pattern Library: Found/Not found

### Abstract Pattern
- Core Function: {abstract_description}
- Input Pattern: {input_type}
- Process Pattern: {transformation_logic}
- Output Pattern: {result_type}

### Domain Match Analysis
- {Domain_A} (XX%): {why_similar} — Reusable: {items}
- {Domain_B} (XX%): {why_similar} — Reusable: {items}

### Common vs Specific
| {Logic_Item} | Q1 | Q2 | Q3 | Classification |
|---|---|---|---|---|
| {item} | Yes/No | Yes/No | Yes/No | Common/Domain/Context-Specific |

### Reusability Score: XX% [🟢/🟡/🔴]

### Impact Assessment
- Design: {what_reusable}
- Data: {what_adaptable}
- New: {what_to_build}

### Lego Assembly Strategy
1. {sub-feature} → {source}
2. {sub-feature} → {source}

### Knowledge Buffer
- [N] new patterns captured
- Strategy: Reuse / Adapt / Create
```

## Classification Decision Tree

```text
Does existing {item} do exactly what I need?
  → Yes: reuse
  → Partially: extend
  → No match at all: create
```

## Smart-Copy Rule

When reusing from existing {assets}:

1. Read source {asset}
2. Select only the needed {component}
3. Trace its dependencies
4. Copy {component} + dependencies only

- ❌ Forbidden: bulk copy entire {asset}
- ✅ Allowed: copy only {component} + dependencies

## Rules

- Always search before creating — the #1 source of waste is duplicate {items} nobody knew existed
- Search by abstract concept, not exact name
- Never conclude "no match" based on name alone — abstract deeper
- Combine best parts from multiple sources ("Lego Assembly") rather than forcing one source to fit
- Must compare with ALL available {domains}, not just obvious ones
- Must calculate reusability from real items, not estimates
- Never guess — only cite what's confirmed in actual content

## Common Pitfalls

- ❌ Checking only 1 {domain} → Fix: compare ALL available {domains}
- ❌ Vague logic (no actual content read) → Fix: must read actual {assets} and cite real items
- ❌ Guessing percentages → Fix: count actual items and calculate
- ❌ Giving up too soon (concluding 0% by name) → Fix: use Deep Abstraction until only flow pattern remains
- ❌ Creating new {item} without checking existing → Fix: always run Phase 3 Asset Scan first
- ❌ Bulk copying entire {asset} → Fix: Smart-Copy Rule — {component} + dependencies only

## Tips

- If >60% can be reused, the task is cheaper than it looks
- If <30% can be reused, consider whether the existing structure fits at all
- This takes 30 seconds of thinking but saves hours of rework
