# Skill Map

> Canonical inventory is `~/.claude/skills/`.
> All paths are relative to `{skills_root}/` (e.g. `~/.claude/skills/`).
> For any dev/QA coding task → start with `governance/aidlc/` first.
> Keywords are semantic — match by meaning, not exact string.
> Bilingual triggers (TH/EN) are in each SKILL.md description.

## Quick Commands (`~/.claude/commands/`)

| Command | Route to | What it does |
|---------|----------|-------------|
| `/spec` | `governance/aidlc/` Phase 0→1 | Define requirements, inception, DECISIONS file |
| `/plan` | `governance/aidlc/` Phase 2 | Break spec into tasks (qa-task-design / dev-task-design) |
| `/build` | `governance/aidlc/` Phase 3 | Implement tasks one by one, commit each |
| `/test` | `qa/playwright-testing/` + `debugging/debug-mantra/` | Write/run tests, triage failures |
| `/review` | `review/review-personas/` | Pre-merge review (code + security + test coverage) |
| `/simplify` | `dev/code-simplification/` | Reduce complexity, preserve behavior |
| `/ship` | `dev/shipping-launch/` | Pre-launch checklist, staged rollout, monitoring |
| `/resume` | Scan `.aidlc/` → find last phase → continue | Pick up where you left off |

> Commands are shortcuts, NOT bypasses — prerequisites still apply.

---

## governance/ — Process Control

| Keyword | Skill |
|---------|-------|
| **AUTO-DETECT** any SDLC intent: implement, build, create, test, fix bug, deploy, design API/DB, write code, automation | `governance/aidlc/` |
| spawn subagent, parallel tasks, dispatch agent, subagent-driven, 2-stage review | `governance/subagent-driven/` |

## thinking/ — Ideation, Analysis & Decision-Making

| Keyword | Skill |
|---------|-------|
| brainstorm, คิดก่อน, party mode, explore idea, 3 amigos, คุยก่อนแบ่งงาน | `thinking/brainstorming/` ← Phase 1.8 (หลัง Inception, ก่อน Task Design) |
| interview me, ถามทีละข้อ, grill me, สัมภาษณ์, underspecified | `thinking/interview-me/` ← BEFORE Phase 0 |
| doubt, adversarial review, verify decision, scrutinize, second opinion | `thinking/doubt-driven/` |
| analyze, gap analysis, requirements, reverse-eng | `thinking/analysis-skills/` |
| verify docs, cite source, official docs, check API version | `thinking/source-driven/` |

## dev/ — Implementation & Architecture

| Keyword | Skill |
|---------|-------|
| domain design, DDD, bounded contexts, system architecture | `dev/dev-architect/` |
| backend API, node, python, C#, docker | `dev/backend-dev/` |
| frontend React, Next.js, Flutter, Swift | `dev/frontend-dev/` |
| CI/CD, github actions, pipeline, commit, push | `dev/devops-pipeline/` |
| design quality, anti-AI-slop, craft UI, impeccable | `dev/impeccable-design/` |
| OWASP, secure coding, auth hardening, XSS, injection | `dev/security-hardening/` |
| ship, deploy, launch, rollback, feature flag, staged rollout | `dev/shipping-launch/` |
| simplify, refactor, reduce complexity, Chesterton's Fence | `dev/code-simplification/` |
| deprecate, migrate, sunset, dead code, strangler fig | `dev/deprecation-migration/` |
| ADR, architecture decision, changelog, API docs | `dev/documentation-adrs/` |

## qa/ — Quality & Testing

| Keyword | Skill |
|---------|-------|
| write/run/fix playwright tests | `qa/playwright-testing/` |
| browser CLI, navigate, screenshot | `playwright-cli/` |
| QA architecture, test framework design | `qa/qa-architect/` |
| test scenario, test case design | `qa/test-scenario/` |
| write/run/fix RF mobile tests | `qa/robotframework-testing/` |
| load test, k6, performance, Core Web Vitals, LCP, INP | `qa/performance-testing/` |
| verify, verification loop, quality gate, pre-commit check | `qa/verification-loop/` |
| eval, measure skill quality, consistency check, pass@k | `qa/eval-harness/` |

## debugging/ — Bug Lifecycle

| Keyword | Skill |
|---------|-------|
| debug, fix failing test, triage error, root cause, reproduce, /debug-mantra | `debugging/debug-mantra/` |
| find bugs, hunt mismatches, scan for bugs, bug lifecycle | `debugging/find-mismatch/` |
| post-mortem, RCA, root cause record, document fix, /post-mortem | `debugging/post-mortem/` |

## review/ — Code Review & Communication

| Keyword | Skill |
|---------|-------|
| review code, pre-merge, security audit, find bugs | `review/review-personas/` |
| management talk, exec summary, status update, less technical | `review/management-talk/` |

## tooling/ — Integrations & Utilities

| Keyword | Skill |
|---------|-------|
| postman migration to playwright | `tooling/postman-to-playwright/` |
| PBI #xxx, ทำ PBI, ดู Bug, upload TS, close PBI, sprint report, azure devops | `tooling/azure-devops-bridge/` |
| UI to text, screenshot to description | `tooling/ui-to-text/` |
| export requirements, req doc | `tooling/req-exporter/` |

## rules/ — Coding Standards

| Keyword | Skill |
|---------|-------|
| playwright standards | `rules/playwright-rules/` |
| test scenario rules, CSV format | `rules/test-scenario-rules/` |
| robot framework standards | `rules/robotframework-rules/` |
| industry design rules | `rules/industry-rules/` |

## ux-ui/ — Design

| Keyword | Skill |
|---------|-------|
| UI design, figma, design system, tokens | `ux-ui/ui-designer/` ← use before frontend-dev |

## meta-skills/ — Generic Reusable Skills

| Keyword | Skill |
|---------|-------|
| CoT, LATS, AoT, reasoning technique | `meta-skills/ai-techniques/` |
| analysis concepts, abstraction templates, reusable reasoning patterns | `meta-skills/analysis-concept/` |
| knowledge graph, project map, dependency map, graph report | `meta-skills/graph-report/` |
| create new skill | `meta-skills/skill-creator/` |
| create hook | `meta-skills/hook-creator/` |
| agent memory, bootstrap memory, setup memory, session flow | `meta-skills/agent-memory/` |
| hermes delegate, ask hermes, hermes second opinion, hermes graphify | `meta-skills/hermes-graphify/` |
| approve skill draft, review draft skill | `drafts/` |

## Personal Skills (Claude-only, not synced to Kiro)

| Keyword | Skill |
|---------|-------|
| find stocks, screen stocks, portfolio review, earnings preview | `finance/` |
| workout plan, nutrition, body composition | `fitness/` |
| accounting, tax, VAT, WHT, Thai GAAP, TFRS | `thai-accountant/` |
| code tips, productivity tips, workspace setup | `claude-code-tips/` |
