# Agent Core — Shared Instructions (SSOT)

> Used by Claude, Gemini, Codex. Sourced from `.claude/shared/agent-core.md`.

## Reading Order & Trust Priority

When information conflicts, higher items win:

1. Latest explicit user instruction
2. Verified codebase state (grep/read before acting)
3. `.claude/shared/` files (skill-map, project-rules, citation-format — inlined in each agent's config)
4. Agent-specific file — tier routing, escalation, cache rules
5. `agent-memory/palace/state.md` — active session state
6. Skill files at `{skills_root}/` (e.g. `~/.gemini/skills/`, `~/ai-agent/skills/`, or project `ai-agent/skills/`)

If notes conflict with the codebase, trust the codebase.

## Plan Mode (Mandatory Rule)

**Before any non-trivial implementation, enter plan mode.**

Use `EnterPlanMode` when:
- New feature implementation (multiple files, unclear scope)
- Multiple valid approaches exist (need to choose one)
- Code modifications affecting behavior or structure
- Architectural decisions required
- Multi-file changes likely
- Requirements unclear (explore first)
- User preferences matter (present options)

Do NOT use plan mode for:
- Single-line or few-line fixes
- Simple one-function additions with clear requirements
- Research/exploration tasks (use Agent tool instead)
- Tasks with explicit detailed instructions

Plan output:
1. Explore codebase (Glob, Grep, Read)
2. Understand existing patterns
3. Design implementation approach
4. Present plan to user for approval via `ExitPlanMode`
5. Use `AskUserQuestion` if approach unclear

---

## Design & Craftsmanship Rules (Premium Standards)

**Craft UI/code like a senior engineer ships to production.**

### Foundational Tokens (Centralized)
- **Color:** Use design tokens from `.claude/shared/` or design system (not hardcoded hex)
- **Typography:** Consistent font families, sizes, weights, line heights
- **Spacing:** Modular scale (8px, 12px, 16px, 24px, 32px base units)
- **Shadows:** Depth hierarchy (shadow-sm, shadow-md, shadow-lg)
- **Borders:** Consistent radius (0px, 4px, 8px, 12px)
- **Duration:** Consistent animation timing (150ms, 250ms, 350ms)

### Reusable Components
- Extract repeated patterns → shared components
- Props-based customization (not copy-paste variants)
- Accessible by default (ARIA labels, semantic HTML, keyboard nav)
- Dark mode support built-in (not an afterthought)

### Typography Hierarchy
- **Display:** Large, bold, headlines (32px+)
- **Heading:** Section titles (24px)
- **Subheading:** Subsection titles (18px)
- **Body:** Content (16px)
- **Label:** Form labels, captions (14px)
- **Caption:** Metadata, hints (12px)

### Anti-AI-Slop (Checklist)
- [ ] No generic placeholder text ("Click here", "Submit")
- [ ] No orphaned UI elements (every control has clear purpose)
- [ ] No inconsistent spacing or alignment (use grid/flex)
- [ ] No forgotten states (hover, focus, active, disabled)
- [ ] No color contrast fails (WCAG AA minimum)
- [ ] No tiny unreadable text (14px minimum for body)
- [ ] No cluttered layouts (whitespace is content)
- [ ] No missing feedback (loading states, error messages, success confirmations)

### Code Craftsmanship
- **Naming:** Clear, pronounceable, intent-revealing (not `temp`, `data`, `thing`)
- **Functions:** Single responsibility, <20 lines when possible
- **Comments:** Why, not what (code shows what, comments explain why)
- **DRY:** Extract common patterns → utilities/helpers
- **Testability:** Arrange-Act-Assert pattern, one concept per test
- **Performance:** Profile before optimizing, measure after changes

---

## Performance Awareness Rule

**Optimize mindfully. Measure, don't guess.**

### Token Budgeting
- Track context usage: system prompt, conversation history, output tokens
- Avoid wasteful patterns:
  - ❌ Outputting entire files when summary suffices
  - ❌ Long narration (use terse summaries)
  - ❌ Verbose explanations without asking
  - ❌ Re-reading same file multiple times
- Compress aggressively when approaching limit (use `/compact` command)
- Use extended thinking only for complex problems (toggle with `/fast` for simple tasks)

### Batch Operations
- Group independent operations: read 5 files in parallel (not sequential)
- Chain dependent operations: build after changes complete
- Defer expensive operations: run tests/build at end, not mid-session

### Response Efficiency
- Lead with summary, details after (user decides depth)
- Use tables for comparisons (visual parsing is faster)
- Cite line numbers/paths (saves user search time)
- No unnecessary context: skip explanations user already knows

### When to Optimize
- ✅ Token approaching 70% → compress or `/compact`
- ✅ Same query run 2x → cache/reuse result
- ✅ Multiple file changes → batch into one commit
- ❌ Don't premature optimize: readable code > unreadable optimization

---

## Security Checklist (Mandatory for Code/Config)

**Never ship insecure code. Check before committing.**

### Input Validation
- [ ] User input sanitized (no injection: SQL, XSS, command)
- [ ] File uploads validated (size, type, malware scan)
- [ ] API requests validated (auth, rate limits, schema)
- [ ] Environment variables checked (required ones present, no defaults for secrets)

### Data Handling
- [ ] PII encrypted in transit (HTTPS, TLS 1.2+)
- [ ] PII encrypted at rest (if stored, use encryption key)
- [ ] Credentials never in code (use .env, environment variables, vaults)
- [ ] Logs don't leak secrets (filter auth tokens, passwords, API keys)
- [ ] Error messages don't expose internals (database details, stack traces in production)

### Access Control
- [ ] Authentication required for protected endpoints (not optional)
- [ ] Authorization checked (user can only access own data)
- [ ] Role-based access enforced (admin != user)
- [ ] Session tokens expire (logout clears token)

### Dependencies
- [ ] No known CVEs in dependencies (run `npm audit`, `pip audit`)
- [ ] Dependencies pinned/locked (reproducible builds, no surprise updates)
- [ ] Unused dependencies removed (smaller attack surface)

### OWASP Top 10 Check
- [ ] SQL Injection: parameterized queries, no string concatenation
- [ ] Broken Authentication: strong passwords, no hardcoded creds
- [ ] Sensitive Data Exposure: encryption in transit + at rest
- [ ] XML External Entities: disable if parsing XML
- [ ] Access Control: principle of least privilege
- [ ] Security Misconfiguration: default creds removed, security headers set
- [ ] XSS: input sanitized, output encoded
- [ ] Insecure Deserialization: validate serialized data before deserialization
- [ ] Using Components with Known Vulnerabilities: audit + update
- [ ] Insufficient Logging & Monitoring: security events logged

### Before Committing
- [ ] No credentials in git history (check git log)
- [ ] No .env files committed (in .gitignore)
- [ ] Security-critical paths tested (auth, payment, data deletion)
- [ ] Secret scanning passed (GitHub, GitLab, or local tool)

---

## Testing Strategy (Mandatory Coverage)

**Write tests that matter. Don't test the framework.**

### Unit Tests
- Test business logic (calculations, validations, transformations)
- Mock external dependencies (API calls, databases, file systems)
- Pattern: Arrange → Act → Assert (AAA)
- Coverage target: 80%+ for critical paths
- Avoid: testing framework code (React.render, database connection)

### Integration Tests
- Test components working together (auth + API + database)
- Use real or containerized dependencies (not mocks)
- Test the actual contract (what user sees, not internals)
- Example: "Login with valid credentials → redirects to dashboard"

### End-to-End Tests
- Test full user flow (signup → login → transaction → logout)
- Run in production-like environment
- Cover happy path + major failure modes
- Tools: Playwright, Cypress, Selenium

### Coverage Guidelines
| Tier | Target | Focus |
|------|--------|-------|
| Unit | 80%+ | Business logic, calculations |
| Integration | 60%+ | Component contracts |
| E2E | Critical paths | User workflows |

### Testing Checklist
- [ ] Happy path tested (normal flow works)
- [ ] Edge cases tested (empty, null, max, min values)
- [ ] Failure modes tested (error handling, recovery)
- [ ] Async tested (promises resolve, timeouts work)
- [ ] No flaky tests (consistent results, no random failures)
- [ ] Tests run in CI (commit blocks if tests fail)
- [ ] New code has test coverage (not just existing code)

### When NOT to Test
- ❌ Framework code (React.render, library internals)
- ❌ Configuration (no tests for .env parsing, unless custom)
- ❌ Trivial getters/setters (property assignment doesn't need test)

---

## Backwards Compatibility Rule (Explicit)

**Breaking changes are expensive. Avoid them.**

### When Changes Are Breaking
- Renamed public function / class / export
- Changed function signature (parameters, return type)
- Removed property / method / field
- Changed data structure format (JSON, database schema)
- Changed API response format or status codes
- Changed behavior without warning

### Before Making Breaking Changes
- [ ] Is non-breaking alternative possible? (new function, new field, deprecation)
- [ ] Have you documented deprecation path? (what users should migrate to)
- [ ] Is migration guide provided? (step-by-step, code examples)
- [ ] Did you bump major version? (Semantic Versioning: MAJOR.minor.patch)
- [ ] Is changelog updated? (what changed, why, migration steps)

### Handling Breaking Changes
1. **Deprecate first** (1-2 releases):
   - New API exists alongside old
   - Old API logs warning: "X is deprecated, use Y instead"
   - Deprecation period: at least one release cycle

2. **Migrate together**:
   - Provide codemods / migration scripts when possible
   - Update all internal uses
   - Update documentation + examples

3. **Remove** (next major version):
   - Old API removed entirely
   - Clear changelog entry: "BREAKING: X removed (was deprecated in v1.5)"

### Non-Breaking Alternatives
- Add new parameter (keep old optional)
- Add new method (keep old working)
- Add new field (don't remove old ones)
- Create new endpoint (keep old one)
- Extend data structure (don't shrink it)

---

## Documentation Standard (Mandatory)

**Document the Why, not the What. Code shows What.**

### Code Comments
**Good:** Explains decision, gotcha, constraint
```javascript
// Fetch twice: first call primes cache, second gets fresh data
// (API doesn't support cache headers, so manual refresh needed)
const data = await fetch('/api/data');
const fresh = await fetch('/api/data');
```

**Bad:** Repeats code
```javascript
// Increment counter
counter++;
```

**Rule:** Comments should answer "Why is this code here?" or "Why this approach?"

### README.md (Project Level)
- [ ] One-line description (what is this?)
- [ ] Quick start (npm install, how to run)
- [ ] Architecture overview (where are things?)
- [ ] Development setup (clone, dependencies, environment)
- [ ] How to test (unit, integration, e2e)
- [ ] How to deploy (build, environment, servers)
- [ ] Contributing guidelines (PR process, code style)
- [ ] License

### API Documentation
- [ ] Endpoint list (GET /users, POST /users, etc.)
- [ ] Request/response format (with examples)
- [ ] Authentication method (Bearer token, API key, session)
- [ ] Status codes (200 OK, 400 Bad Request, 500 Server Error)
- [ ] Error responses (error message format, codes)
- [ ] Rate limits (requests/minute, throttling)
- [ ] Example: cURL, Python, JavaScript

### Inline Documentation (Functions/Classes)
```javascript
/**
 * Calculate compound interest.
 * @param principal Starting amount (USD)
 * @param rate Annual interest rate (decimal: 0.05 = 5%)
 * @param years Investment period
 * @returns Total amount after interest
 * @throws RangeError if principal < 0 or rate > 1
 */
function calculateInterest(principal, rate, years) {
  // ...
}
```

**Format:** JSDoc, Docstrings, or equivalent for language

### Changelog.md
- [ ] Latest first (newest changes on top)
- [ ] Date of release (YYYY-MM-DD)
- [ ] Version number (Semantic Versioning)
- [ ] Three sections: Added, Changed, Fixed, Removed, Deprecated
- [ ] Breaking changes marked clearly (⚠️ BREAKING)
- [ ] Migration guides for breaking changes

### Type Definitions (TypeScript / Python)
- [ ] Interfaces for data structures
- [ ] Function signatures with types
- [ ] Return types explicit (not `any`)
- [ ] Generics for reusable structures
- [ ] Comments for complex types

### Decision Log (ADR - Architecture Decision Records)
For significant decisions, document:
- [ ] What was decided
- [ ] Why (context, constraints, alternatives considered)
- [ ] When (date)
- [ ] Who decided (team members)
- [ ] Trade-offs (what we gained vs. lost)

---

## Karpathy Principles (always active)

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Escalation & Handoff Rules (When to STOP)

**Stop and ask user when:**
- **Ambiguous requirements** — multiple valid interpretations, user must choose
- **Blocked by external dependency** — need user credential, API key, decision, or permission
- **Destructive operation** — delete, force push, breaking change, data migration
- **Security/compliance concern** — potential vulnerability, data exposure, regulatory issue
- **3+ different approaches failed** — not retries of same thing, but different strategies
- **Performance/cost impact unclear** — potential for expensive operation, long wait time, or resource exhaustion
- **User preference matters** — multiple valid solutions, no "right" answer

Don't keep struggling. Escalate early, escalate clearly.

---

## Quality Gates (Pre-Done Checklist)

**Before marking task complete, verify:**
- [ ] **Build passes** — no new errors, warnings, or compilation failures
- [ ] **Tests pass** — all relevant tests green (not skipped)
- [ ] **Edge cases handled** — empty inputs, null, max/min values, boundary conditions
- [ ] **Backwards compatible OR documented** — breaking changes clearly noted with migration path
- [ ] **Code clarity** — comments explain WHY, not WHAT (code already shows what)
- [ ] **Git log tells story** — commits are logical, messages describe intent
- [ ] **User can verify** — result is independently testable/observable by user
- [ ] **No new tech debt** — temporary workarounds documented with removal plan

If any check fails, task is not done. Fix it or escalate.

---

## Error Recovery Strategy (What to Do When It Fails)

**Progression for handling failures:**

1. **Diagnose (not panic)**
   - Read error message completely
   - Identify root cause, not symptom
   - Verify assumption: "I thought X, but it's actually Y"

2. **Adjust approach (don't retry)**
   - Try different strategy (not same thing again)
   - Gather more information if needed
   - Modify input, path, or method

3. **Verify fix works**
   - Test the fix
   - Confirm original problem is solved
   - Check for side effects

4. **Loop or escalate**
   - If fix works: continue
   - If 3 different approaches fail: escalate (see Escalation Rules)
   - Track what was tried (helps user understand the problem)

**Key rule:** After 3 *different* attempts fail, stop trying. Ask user.

---

## State Management (Manual)

### Mandatory Checklist — Turn Start
- [ ] **Check** whether `agent-memory/palace/state.md` exists
- [ ] **Read** it before substantial reasoning or tool use when it exists
- [ ] **Use** Current Focus, Open Threads, blockers, and next steps as working context
- [ ] **Continue** normally without blocking the turn if the file is missing or stale

### Mandatory Checklist — Turn End
- [ ] **Decide** whether the turn produced meaningful working context
- [ ] **Update** `state.md` only if at least one is true: a decision was made, a direction was committed, a blocker was identified, next steps became clearer, or concrete implementation/testing progress happened
- [ ] **Write** only a concise summary that helps the next turn continue work
- [ ] **Skip** `state.md` updates for pure Q&A, no-decision turns, compare-only discussion, brainstorming without commitment, or general conversation
- [ ] **Commit** if files changed and the task requires completion proof

> Summary rule: action verbs only (Added, Fixed, Updated, Completed, Migrated). Exclude: discussions, no-decision turns, compare-only turns, and general learnings.

## agent-memory/ Usage Guide

### Resolution Order (MANDATORY — check before every session)

```
1. Per-project:  {project_root}/agent-memory/    ← check first
2. Global:       ~/.claude/agent-memory/          ← fallback if no per-project

For knowledge specifically:
  1. {project_root}/agent-memory/knowledge/
  2. {project_root}/ai-agent/skills/ai-dlc/knowledge/
  3. ~/.claude/skills/ai-dlc/knowledge/
```

**If per-project `agent-memory/` does NOT exist:**
→ Run `setupMemory.sh` to create it (or create manually using structure below)
→ Do NOT silently use global only — always create per-project first

**Required structure (every `agent-memory/` must have ALL of these):**
```
agent-memory/
├── palace/
│   ├── state.md              ← session state (≤100 lines)
│   ├── tunnels.md            ← cross-wing links
│   ├── search-index.md       ← flat search fallback
│   ├── user-profile.md       ← user preferences (≤80 lines)
│   ├── date-index.json       ← sorted date array for date-range queries
│   ├── keyword-index.json    ← inverted index for keyword search
│   ├── wings/                ← topic wings (hall.md + rooms/ + closets/)
│   └── archive/
│       └── index.md          ← archive index
└── knowledge/
    ├── index.json            ← domain catalog + utility_score
    └── lessons/{domain}/     ← captured lessons per domain
```

**state.md** (Turn tracking)
- UPDATE if: decision made, direction committed, blocker identified, next steps clearer, implementation/testing progress
- SKIP if: pure Q&A, no-decision turns, compare-only discussion, brainstorming without commitment, general conversation
- Scope: This session's working context + progress
- Format: Action verbs only (Added, Fixed, Updated, Completed, Migrated)

**knowledge/** (Lessons & patterns)
- CREATE if: discovered a reusable pattern, found a best practice worth repeating, captured a gotcha/lesson learned
- UPDATE: `knowledge/index.json` utility_score + usage_count after every scoreable outcome
- UPDATE: `knowledge/lessons/{domain}/*LessonsIndex.json` when new lesson captured
- Examples: design-tokens.md, error-recovery-strategy.md, testing-best-practices.md
- Scope: Cross-project patterns (useful in future sessions)
- Format: Lesson frontmatter + examples + decision rationale

**palace/wings/** (Persistent evolution tracking)
- CREATE if: major capability added, architecture decision made, significant learning accumulated
- UPDATE: hall.md when rooms added/removed
- UPDATE: tunnels.md when cross-wing references created
- UPDATE: search-index.md + keyword-index.json + date-index.json at session end
- Examples: agent-rules-evolution.md (tracks rule versions), wings architecture changes
- Scope: Project evolution & growth over time (visible to future team members)
- Format: Timestamped rooms with metadata

### Update Contract (Session End — MANDATORY)

When dirty=true, update ALL of the following that apply:

| What changed | Update |
|---|---|
| Decision made / direction committed | `palace/state.md` (Current Focus + Open Threads) |
| New room written | `palace/wings/{wing}/hall.md` + `palace/search-index.md` |
| Cross-wing reference | `palace/tunnels.md` |
| New lesson captured | `knowledge/lessons/{domain}/*LessonsIndex.json` |
| Tool succeeded on project-relevant task | `knowledge/index.json` (utility_score +0.5, usage_count++) |
| Tool failed on known issue | `knowledge/index.json` (utility_score -1.0) |

**Never update only state.md and skip knowledge/palace — all relevant files must be updated together.**

## Do Not Store

Never record: secrets/credentials, raw chat transcripts, chain-of-thought reasoning, speculative notes without evidence, duplicate summaries already in `agent-memory/`.

## Placeholder Convention

```
{project_root}   = root directory of the active project (walk up from cwd)
{knowledge_root} resolves in order:
  1. {project_root}/agent-memory/knowledge/
  2. {project_root}/ai-agent/skills/ai-dlc/knowledge/
  3. ~/.claude/skills/ai-dlc/knowledge/

{skills_root}    = {project_root}/skills/ or {project_root}/ai-agent/skills/
{cwd}            = current working directory
```
