# Reverse Engineering Concept

Scan an existing system to understand its structure before starting new work.

Adapted from: `thinking/analysis-skills/references/reverse-eng.md`

## When to use

- Joining an existing system (brownfield)
- Need to understand what's already built before adding to it
- Documenting an undocumented system

## Thinking Pattern

### Step 0: Check Existing Context

- If documentation already exists → compare with current state
- Only update sections that changed — don't rewrite everything

### Step 1: Detect {System} Type

- Look for existing {artifacts} — no {artifacts} = greenfield, skip this
- Identify: is this new or existing?

### Step 2: Identify {Stack}

- Scan configuration files, manifests, metadata
- Determine: what technologies, formats, conventions are used?

### Step 3: Analyze Architecture

- {Structure} layout, entry points, configuration
- Pattern: monolith / modular / distributed / hierarchical
- Integration points with external systems

### Step 4: Map Structure

- Key components and their responsibilities
- Where {core_logic} lives
- {Data_models} and their relationships
- {Interface_points} (APIs, entry points, connections)

### Step 5: Document Findings

Write structured context covering:
- What the {system} does (purpose, key features, users)
- How it's built (technology, patterns, conventions)
- How it's organized (structure, boundaries, integration)

## Output Pattern

```text
Purpose: {what_it_does, key_features, user_types}
Technology: {stack, formats, conventions}
Architecture: {pattern, boundaries, integration_points}
Structure: {key_components, data_models, interfaces}
Recommendations: {suggested_approach_for_new_work}
```

## Rules

- Only document what you actually find — never hallucinate
- If context files already exist, compare and update only changed sections
- Scan the actual system, not assumptions about it

## Tips

- Focus on understanding the "why" behind structural decisions
- Look for patterns and conventions that new work should follow
- Document integration points — these are where new work connects
