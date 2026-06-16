# Skill Auto-Detect Keyword Tables

Read when: routing to a skill, user invokes `/skill-name`, or skill selection is unclear (also referenced from `project-rules.md`'s mandatory skill auto-detect rule).

When the user's message matches ANY keyword below — invoke the matching skill via `Skill()` tool immediately, before responding. Detection is semantic (match by meaning, not exact string). Do NOT wait for the user to say "use skill X".

**Priority order:** AIDLC fires first → then skill auto-detect runs inside that flow (or standalone for non-SDLC tasks).

**thinking/ — Ideation & Analysis**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| brainstorm, คิดก่อน, party mode, explore idea, 3 amigos, คุยก่อน | `brainstorming` |
| interview me, ถามทีละข้อ, grill me, underspecified, ยังไม่มี code | `interview-me` |
| interview with docs, ถามกับ code, ตรวจสอบกับ codebase, align language | `interview-doc` |
| doubt, adversarial review, second opinion, scrutinize, verify decision | `doubt-driven` |
| analyze, gap analysis, requirements, reverse-eng | `analysis-skills` |
| verify docs, cite source, official docs, check API version | `source-driven` |

**dev/ — Implementation & Architecture**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| TypeScript, JavaScript, Node.js, Express, NestJS, REST API, GraphQL | `backend-dev` |
| React, Next.js, Tailwind, Vite, Vue, component, hook, state management | `frontend-dev` |
| Flutter, Dart, mobile app, Android, iOS (non-SwiftUI) | `frontend-dev` |
| macOS, SwiftUI, NSHostingView, AppKit, drag-drop | `macos-swiftui` |
| Docker, GitHub Actions, CI/CD, pipeline, deploy, infrastructure | `devops-pipeline` |
| OWASP, XSS, injection, auth hardening, secure coding | `security-hardening` |
| DDD, bounded context, event storming, system architecture | `architect` |
| ship, launch, rollback, feature flag, staged rollout | `shipping-launch` |
| simplify, refactor, reduce complexity | `code-simplification` |
| deprecate, migrate, sunset, strangler fig | `deprecation-migration` |
| ADR, architecture decision, changelog, API docs | `documentation-adrs` |

**qa/ — Testing**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| Playwright, Vitest, Jest, E2E, unit test, write test, fix test | `playwright-testing` |
| QA architecture, test framework design | `qa-architect` |
| test scenario, test case design | `test-scenario` |
| Robot Framework, RF mobile test | `robotframework-testing` |
| k6, load test, performance, Core Web Vitals, LCP, INP | `performance-testing` |
| verify, quality gate, pre-commit check, verification loop | `verification-loop` |

**debugging/ — Bug Lifecycle**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| debug, fix failing test, triage error, root cause, reproduce | `debug-mantra` |
| find bugs, hunt mismatches, scan for bugs, bug lifecycle | `find-mismatch` |
| post-mortem, RCA, root cause record, document fix | `post-mortem` |

**review/ — Code Review**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| review code, pre-merge, security audit, find bugs | `review-personas` |
| management talk, exec summary, status update, less technical | `management-talk` |

**tooling/ — Integrations**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| postman migration to playwright | `postman` |
| PBI, azure devops, sprint report, upload test scenario, ADO | `azure-devops-bridge` |
| UI to text, screenshot to description | `ui-to-text` |

**ux-ui/ — Design**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| UI design, figma, design system, polish UI, anti-AI-slop, improve colors, fix typography | `ui-designer` |

**Personal skills**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| find stocks, screen stocks, portfolio review, earnings preview | `finance/` |
| workout plan, nutrition, body composition | `fitness/` |
| accounting, tax, VAT, WHT, Thai GAAP, TFRS | `thai-accountant/` |

**Do NOT auto-invoke for:** pure "what is X?" questions with no task intent.

---

## Conflict Resolution

When a message matches keywords from multiple skills, apply these tiebreaker rules in order:

**Rule 1 — Primary verb wins over context noun.**
The action keyword determines the skill; the subject is context.
- "debug a Playwright test" → `debug-mantra` (verb: debug), not `playwright-testing`
- "fix failing Playwright test" → `playwright-testing` (fix failing test is Playwright's domain)
- "review code for security" → `review-personas` (verb: review), not `security-hardening`
- "build Docker CI/CD" → `devops-pipeline` (artifact is infra), not `backend-dev`

**Rule 2 — Category priority when Rule 1 doesn't resolve.**
Higher priority wins:

| Priority | Category |
|----------|----------|
| 1 (highest) | debugging/ — bug lifecycle, root cause |
| 2 | qa/ — test execution, test fix |
| 3 | dev/ — implementation, architecture |
| 4 | thinking/ — analysis, ideation |
| 5 | review/ — code review |
| 6 | tooling/ — integrations |
| 7 (lowest) | personal — finance, fitness, tax |

**Rule 3 — Explicit conflict table** for recurring ambiguous pairs:

| Trigger | Preferred skill | Reason |
|---------|----------------|--------|
| "debug failing Playwright test" | `debug-mantra` | Diagnosing > executing |
| "write and fix Playwright test" | `playwright-testing` | Full cycle, no unknown bug |
| "review Playwright test quality" | `review-personas` | Review > test |
| "migrate Playwright tests to Robot Framework" | `robotframework-testing` | Target framework wins |
| "analyze codebase for gaps" | `analysis-skills` | No code output intent |
| "analyze then implement" | AIDLC first | Has build intent → AIDLC gate |
| "ADR for Docker infra" | `documentation-adrs` | Documentation artifact is primary |
| "deprecate and migrate REST API" | `deprecation-migration` | Lifecycle > API type |
