# Adapted AI Techniques for Memory Palace

Principles adapted from ai-dlc/core — same thinking, different content (wings/rooms instead of code/business rules).

## Step-Back Protocol

Zoom out before loading context — identify what's needed before reading files.

```text
On Session Start:
1. "What is the task?" — identify primary goal
2. "Which wings are relevant?" — don't load everything
3. "What did I decide last time?" — check open threads
4. "What's the token budget?" — plan before loading
```

## Wing Discovery (Anti-Redundancy)

Search palace for existing wings/rooms before creating new ones.

```text
Before creating a new room:
1. Read state.md → list all active wings
2. Read hall.md of relevant wings → list all rooms
3. Deep Abstraction Match: does any existing room cover this topic?
   - Forget specific names — look at concept: Input → Process → Output
   - "auth-decisions" might cover "jwt-architecture" (same abstract concern)
4. Classify:
   - reuse → write into existing room
   - extend → add section to existing room
   - create → ONLY if no existing room covers this concept
```

**Anti-Redundancy Rule:** Never create duplicate rooms.

## Abstract Domain Matching

Match task against wings using Deep Abstraction — never conclude "no match" based on wing name alone.

```text
Deep Abstraction Protocol for Wings:
1. Forget wing names — look at flow pattern only
2. Analogical Reasoning:
   - "postman-migration" = "toolchain migration" (abstract)
   - "ai-dlc-skills" = "skill ecosystem management" (abstract)
   - New task "migrate Cypress to Playwright" → matches "toolchain migration" pattern
3. If no surface match → abstract deeper until only flow pattern remains
4. Stop condition: generic I/O with no structural similarity → create new wing
```

## Memory Gap Analysis

Compare required context vs available rooms after Wing Discovery.

```text
After Wing Discovery:
1. Extract: what context does this task need?
2. Match against existing rooms:
   - Direct Match → room has exactly what's needed
   - Partial Match → room has related info, needs update
   - No Match → new room needed
3. Prioritize gaps:
   - Critical → task can't proceed without this context
   - High → wrong decisions without this context
   - Medium → slower work without this context
   - Low → nice to have
```

## Context Extraction

Extract task context before classifying wings.

```text
Before Wing Classification:
1. What is the task? (goal)
2. What domains does it touch? (wing candidates)
3. What decisions were made before? (open threads)
4. Any conflicts with existing facts? (contradiction check)
```

## Reasoning Chain (CoT) for Wing Classification

```text
Step 1: Read state.md → list N active wings
Step 2: Extract task keywords → [keyword1, keyword2, ...]
Step 3: For each wing, score relevance (0–10)
Step 4: Hot = score ≥ 5, Cold = score < 5
Step 5: Token budget check → sum Hot_Wing Token_Estimate values
Conclusion: Load [N] Hot_Wings, [M] Cold_Wings as summaries
```
