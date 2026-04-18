# Wing Analysis

How to discover, classify, create, and manage wings.
Combines: `analysis-concept/discovery-domain-concept.md` + `analysis-concept/context-concept.md` + `ai-techniques/cot.md`

## 1. Wing Classification (Session Start)

Before loading wings, Step-Back first (from context-concept Phase 1):

- What is the task? What does success look like?
- Which wings are likely relevant?
- What did I decide last session? (check Open Threads)
- What's the token budget?

Then classify using CoT (from ai-techniques/cot.md):

```text
Step 1: Read state.md → list all active wings
Step 2: Extract task keywords → [keyword1, keyword2, ...]
Step 3: For each wing, score relevance (0–10)
Step 4: Hot = score ≥ 5, Cold = score < 5
Step 5: Token budget check → sum Hot_Wing Token_Estimate values
Conclusion: Load [N] Hot_Wings, [M] Cold_Wings as summaries
```

On-demand promotion: Cold → Hot when task requires it.

## 2. Wing Discovery (Before Creating New Wing)

From discovery-domain-concept Phases 1-4:

### 2.1: Search Existing Wings (Anti-Redundancy)

1. Read state.md → list all active wings
2. Read hall.md of relevant wings → list all rooms
3. Deep Abstraction Match: does any existing wing cover this topic?

```text
Forget wing names — look at concept:
"postman-migration" = "toolchain migration" (abstract)
"ai-dlc-skills" = "skill ecosystem management" (abstract)
New task "migrate Cypress to Playwright" → matches "toolchain migration"
```

4. Classify:
   - `reuse` → write into existing wing
   - `extend` → add room to existing wing
   - `create` → ONLY if no existing wing covers this concept

**Anti-Redundancy Rule:** Never create duplicate wings.

### 2.2: Abstract Domain Matching

```text
"Forget wing names
 Look at Flow: Input → Process → Output
 Find Abstract Level Patterns"
```

- Never conclude "no match" based on wing name alone
- Abstract deeper until only flow pattern remains
- Stop condition: generic I/O with no structural similarity → create new wing

### 2.3: Common vs Specific (from discovery-domain-concept Phase 4.2)

For each topic, ask:
- Q1: Does this apply to any project? → Common wing (e.g., "dev-tools")
- Q2: Does it need project context? → Project-specific wing (e.g., "postman-migration")
- Q3: Is it tied to a specific sprint/task? → Consider room in existing wing instead

## 3. Wing Creation

Only after Discovery confirms "create":

1. Create `wings/{topic}/hall.md` with Tags, Purpose, empty Rooms table
2. Create first room in `wings/{topic}/rooms/`
3. Update `state.md` Active Wings
4. Check if tunnel needed → update `tunnels.md`

## 4. Wing Archival Decision

When to consider archiving (from gap-concept Step 4 prioritization):
- Wing inactive >2 sprints
- User explicitly requests
- state.md approaching 100 lines

Use LATS (from ai-techniques/lats.md) if unsure:
- Sim 1: Archive now → saves tokens, loses quick access
- Sim 2: Keep active → easy access, costs tokens
- Sim 3: Compress to closets only → middle ground
- Hybrid: usually compress first, archive if still inactive after 1 more sprint

## 5. Common Pitfalls

- ❌ Creating new wing without checking state.md → Fix: always read state.md first, search existing wings
- ❌ Naming wing too specific (e.g., "jwt-token-fix") → Fix: use broader domain name ("auth-decisions")
- ❌ Naming wing too generic (e.g., "misc") → Fix: every wing needs a clear domain boundary
- ❌ Forgetting to update state.md after creating wing → Fix: state.md update is mandatory
- ❌ Not creating hall.md → Fix: hall.md is required for every wing
- ❌ Archiving wing that has active open threads → Fix: check Open Threads before archiving

## 6. Self-Review (before committing wing changes)

After creating or modifying a wing, challenge yourself:

1. **Pre-mortem:** "If this wing structure is wrong, what did I miss?"
2. **Redundancy check:** "Is there another wing that covers the same abstract concept?"
3. **Naming check:** "Would someone reading state.md understand what this wing is about?"
4. **Scope check:** "Is this wing too broad (should split) or too narrow (should be a room instead)?"
