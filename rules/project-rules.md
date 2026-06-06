# Project Rules (overrides/extends shared)

- **AIDLC auto-detect (mandatory):** If the user's intent matches ANY of the signals below — route to `governance/aidlc/` immediately. Do NOT wait for the user to say "start AIDLC".

  **SDLC intent signals (detect by meaning, not exact wording):**
  - **Implement / Build:** implement, build, create, develop, write code, add feature, refactor, migrate, integrate, ทำ, สร้าง, เพิ่ม, แก้ไข, พัฒนา, เขียนโค้ด
  - **Test / QA:** test, testing, QA, automation, automate, test scenario, test case, playwright, robot framework, ทดสอบ, เขียน test, สร้าง test scenario, หา bug
  - **Bug / Fix:** fix bug, debug, reproduce, investigate failure, แก้ bug, หาสาเหตุ
  - **Deploy / DevOps:** deploy, pipeline, CI/CD, release, docker, infrastructure, deploy ขึ้น
  - **Design (technical):** API design, database schema, domain design, architecture, ออกแบบ API, ออกแบบ database
  - **Any verb + software artifact:** "write X", "create X", "fix X", "update X" where X is a file, function, component, service, endpoint, query, script, workflow

  **Do NOT auto-route AIDLC for:**
  - Pure research / analysis / brainstorming questions (no intent to produce code)
  - Finance, fitness, or domain-only knowledge tasks
  - Configuration or settings changes (no SDLC artifacts)

- **Skill auto-detect (mandatory):** When the user's message matches ANY keyword below — invoke the matching skill via `Skill()` tool immediately, before responding. Detection is semantic (match by meaning, not exact string). Do NOT wait for the user to say "use skill X".

  **Priority order:** AIDLC fires first → then skill auto-detect runs inside that flow (or standalone for non-SDLC tasks).

  **thinking/ — Ideation & Analysis**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | brainstorm, คิดก่อน, party mode, explore idea, 3 amigos, คุยก่อน | `thinking/brainstorming/` |
  | interview me, ถามทีละข้อ, grill me, underspecified, ยังไม่มี code | `thinking/interview-me/` |
  | interview with docs, ถามกับ code, ตรวจสอบกับ codebase, align language | `thinking/interview-doc/` |
  | doubt, adversarial review, second opinion, scrutinize, verify decision | `thinking/doubt-driven/` |
  | analyze, gap analysis, requirements, reverse-eng | `thinking/analysis-skills/` |
  | verify docs, cite source, official docs, check API version | `thinking/source-driven/` |

  **dev/ — Implementation & Architecture**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | TypeScript, JavaScript, Node.js, Express, NestJS, REST API, GraphQL | `dev/backend-dev/` |
  | React, Next.js, Tailwind, Vite, Vue, component, hook, state management | `dev/frontend-dev/` |
  | Flutter, Dart, mobile app, Android, iOS (non-SwiftUI) | `dev/frontend-dev/` |
  | macOS, SwiftUI, NSHostingView, AppKit, drag-drop | `dev/macos-swiftui/` |
  | Docker, GitHub Actions, CI/CD, pipeline, deploy, infrastructure | `dev/devops-pipeline/` |
  | OWASP, XSS, injection, auth hardening, secure coding | `dev/security-hardening/` |
  | DDD, bounded context, event storming, system architecture | `dev/dev-architect/` |
  | ship, launch, rollback, feature flag, staged rollout | `dev/shipping-launch/` |
  | simplify, refactor, reduce complexity | `dev/code-simplification/` |
  | deprecate, migrate, sunset, strangler fig | `dev/deprecation-migration/` |
  | ADR, architecture decision, changelog, API docs | `dev/documentation-adrs/` |

  **qa/ — Testing**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | Playwright, Vitest, Jest, E2E, unit test, write test, fix test | `qa/playwright-testing/` |
  | QA architecture, test framework design | `qa/qa-architect/` |
  | test scenario, test case design | `qa/test-scenario/` |
  | Robot Framework, RF mobile test | `qa/robotframework-testing/` |
  | k6, load test, performance, Core Web Vitals, LCP, INP | `qa/performance-testing/` |
  | verify, quality gate, pre-commit check, verification loop | `qa/verification-loop/` |

  **debugging/ — Bug Lifecycle**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | debug, fix failing test, triage error, root cause, reproduce | `debugging/debug-mantra/` |
  | find bugs, hunt mismatches, scan for bugs, bug lifecycle | `debugging/find-mismatch/` |
  | post-mortem, RCA, root cause record, document fix | `debugging/post-mortem/` |

  **review/ — Code Review**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | review code, pre-merge, security audit, find bugs | `review/review-personas/` |
  | management talk, exec summary, status update, less technical | `review/management-talk/` |

  **tooling/ — Integrations**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | postman migration to playwright | `tooling/postman-to-playwright/` |
  | PBI, azure devops, sprint report, upload test scenario, ADO | `tooling/azure-devops-bridge/` |
  | UI to text, screenshot to description | `tooling/ui-to-text/` |

  **ux-ui/ — Design**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | UI design, figma, design system, polish UI, anti-AI-slop, improve colors, fix typography | `ux-ui/ui-designer/` |

  **Personal skills**
  | Keyword signals | Auto-invoke skill |
  |-----------------|-------------------|
  | find stocks, screen stocks, portfolio review, earnings preview | `finance/` |
  | workout plan, nutrition, body composition | `fitness/` |
  | accounting, tax, VAT, WHT, Thai GAAP, TFRS | `thai-accountant/` |

  **Do NOT auto-invoke for:** pure "what is X?" questions with no task intent.

- **AIDLC first:** All dev/QA work goes through `governance/aidlc/` — never call qa/dev skills directly unless AIDLC routes there
- **AIDLC modes:** Support 3 modes — Full (default), QA Only, Dev Only. See `workflow.md` → "Execution Modes" for phase matrix and routing tables.
  - `"start AI-DLC QA scenario only"` → QA Scenario Only (Lite Inception → 2.1 → 2.2)
  - `"start AI-DLC QA automation"` → QA Automation (Lite Inception → 2.1 → 2.2 → 2.3 → 2.4, then asks: API / Web UI / Android / iOS)
  - `"start AI-DLC Dev only"` → Dev Only (Lite Inception → 2.5 → 3.1 → 3.2 → 3.3)
- **AIDLC mode hard rules:** ALL modes MUST use `.aidlc/` folder + DECISIONS→PLAN→EXECUTE. QA modes MUST NOT skip qa-task-design. Dev mode MUST NOT skip dev-task-design.
- **AIDLC exception — Postman migration:** `tooling/postman-to-playwright/` skill bypasses AIDLC entirely.
- **Phase gates:** If prerequisites missing → STOP, tell user what's needed first
- **Phase gate check (MANDATORY):** Before ANY dev/QA work → scan `.aidlc/[system]/[feature]/` for existing outputs → find first missing phase → start THERE, not at the user's requested phase. If no `.aidlc/` folder exists for the feature → start from Phase 0/1.2 (Full mode) or Lite Inception (QA/Dev Only mode). NEVER skip to a later phase. This check MUST happen BEFORE reading spec docs or generating any output.
- **No shortcuts:** "เขียน code เลย" without prerequisites = STOP, not proceed
- **Knowledge check:** Before writing test code, check `knowledge/` for existing templates + lessons
- **Language:** English for all generated files, Thai for user interaction
- **Test:** After every edit → run matching test (mapping: `rules/test-coverage.md`)
- **Build:** Build must pass + commit hash required before task is done
- **Playwright:** no `waitForTimeout()` · `getByTestId` > `getByRole` · AAA pattern
- **Escalate:** Don't retry the same failing approach 3+ times — hand off or ask
- **CONTEXT.md (domain glossary):** Every project should have `{project-root}/CONTEXT.md` — a shared language between human and AI. Create lazily during AIDLC Phase 1 (domain-design) or interview-me when the first domain term is resolved. Update inline whenever a term is sharpened — don't batch. Challenge fuzzy/overloaded terms against existing glossary. Format: `governance/aidlc/references/CONTEXT-FORMAT.md`
