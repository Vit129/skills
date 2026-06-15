# Skill Auto-Detect Keyword Tables

Read when: routing to a skill, user invokes `/skill-name`, or skill selection is unclear (also referenced from `project-rules.md`'s mandatory skill auto-detect rule).

When the user's message matches ANY keyword below — invoke the matching skill via `Skill()` tool immediately, before responding. Detection is semantic (match by meaning, not exact string). Do NOT wait for the user to say "use skill X".

**Priority order:** AIDLC fires first → then skill auto-detect runs inside that flow (or standalone for non-SDLC tasks).

**thinking/ — Ideation & Analysis**
| Keyword signals | Auto-invoke skill |
|-----------------|-------------------|
| brainstorm, คิดก่อน, party mode, explore idea, 3 amigos, คุยก่อน | `brainstorming` |
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
