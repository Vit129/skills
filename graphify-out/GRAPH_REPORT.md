# Graph Report - .claude  (2026-08-21)

## Corpus Check
- 579 files · ~318,779 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4974 nodes · 4824 edges · 521 communities (435 shown, 86 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `114521ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `DateHelper` - 48 edges
2. `Fix Generated Playwright Files (Postman Migration)` - 33 edges
3. `LoginHelper` - 23 edges
4. `DatabaseHelper` - 23 edges
5. `UI Designer` - 19 edges
6. `ToastHelper` - 18 edges
7. `FileUploadHelper` - 17 edges
8. `Agent Memory` - 17 edges
9. `PaginationHelper` - 16 edges
10. `Memory Decay Snapshot (2026-08-17)` - 16 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `Playwright API Testing - Rules & Templates` - bridges 9 areas (15 edges)
2. `Playwright UI Testing - Rules & Templates` - bridges 9 areas (15 edges)
3. `search()` - bridges 2 areas (8 edges)
4. `_resolve_color_mode()` - bridges 2 areas (5 edges)
5. `_select_palette_for_mode()` - bridges 2 areas (4 edges)
6. `DesignSystemGenerator` - bridges 1 areas (11 edges)
7. `Headroom — Context Compression for AI Agents` - bridges 1 areas (11 edges)
8. `Step-by-step` - bridges 1 areas (10 edges)
9. `BM25` - bridges 1 areas (8 edges)
10. `Ponytail — Lazy Senior Dev Mode` - bridges 1 areas (8 edges)

## Surprising Connections (you probably didn't know these)
- `_generate_intelligent_overrides()` --calls--> `search()`  [INFERRED]
  skills/ui-designer/scripts/design_system.py → skills/ui-designer/scripts/core.py
- `main()` --calls--> `skill_invoked()`  [INFERRED]
  hooks/design-gate.py → hooks/_gate_common.py
- `main()` --calls--> `skill_invoked()`  [INFERRED]
  hooks/interview-gate.py → hooks/_gate_common.py
- `content_scan_verdict()` --calls--> `scan()`  [INFERRED]
  hooks/project-skill-trust-gate.py → hooks/memory-write-scan.py
- `cmd_list()` --calls--> `build_timeline()`  [INFERRED]
  scripts/journey_tui.py → scripts/journey_timeline.py

## Import Cycles
- None detected.

## Communities (521 total, 86 thin omitted)

### Community 0 - "API Date & Utility Helpers"
Cohesion: 0.07
Nodes (3): DateHelper, DateOptions, DateRange

### Community 1 - "Fix Generated Playwright Files (Postman Migration)"
Cohesion: 0.04
Nodes (47): 10. Request Body Types 📦, 11. Response Headers 📋, 12. Path Parameters & Query Parameters 🔗, 13. Postman Dynamic Variables 🎲, 14. Folder-level Auth Inheritance 🔐, 15. Folder-level Pre-request Script → beforeAll / beforeEach 🔧, 16. Nested Folders → File Structure 📁, 17. Collection Runner + Data File (Data-Driven) 📊 (+39 more)

### Community 2 - "Postman Collection Parser & Converter"
Cohesion: 0.06
Nodes (38): args, buildResponseSnippet(), collectionVarMap, convertPreRequest(), convertTestScript(), describeTree, detectResponseType(), extractVarsFromText() (+30 more)

### Community 3 - "Appium Testing (Android) - Rules &"
Cohesion: 0.05
Nodes (36): 1. Deep Linking (Fast Navigation Gem), 1. 🎯 Locator Strategy (Android DOM Lookup Strategy), 1. 🏷️ Naming Conventions, 1. 🔑 Testcase ID Requirements, 2. ADB Command Integration (Power User Gem), 2. 🤖 Android-Specific Actions, 2. 🏷️ Required Tags, 2. 🏗️ Test Structure (AAA Pattern) (+28 more)

### Community 4 - "Appium Testing (iOS) - Rules &"
Cohesion: 0.05
Nodes (36): 1. iOS Deep Linking (Fast Navigation Gem), 1. 🎯 Locator Strategy (iOS DOM Lookup Strategy), 1. 🏷️ Naming Conventions, 1. 🔑 Testcase ID Requirements, 2. Biometric Simulation (FaceID/TouchID Gem), 2. 🤖 iOS-Specific Actions, 2. 🏷️ Required Tags, 2. 🏗️ Test Structure (AAA Pattern) (+28 more)

### Community 5 - "Database Connection & Query Helpers"
Cohesion: 0.10
Nodes (5): DatabaseConfig, DatabaseHelper, PgClient, QueryBuilder, QueryResult

### Community 6 - "Training Protocols & Program Design (Unit-Aware)"
Cohesion: 0.06
Nodes (31): Accessory Lifts (Priority 2), Cardio & Conditioning Integration, Cardio + Strength Interference Effect, Compound Lifts (Priority 1), Conversion Guide, Day 1: Chest + Triceps, Day 2: Back + Biceps, Day 3: Legs A (Squat) (+23 more)

### Community 7 - "Postman → Playwright Migration"
Cohesion: 0.06
Nodes (31): 1. URL Placeholders, 2. Auth Header, 3. Fixtures & Schemas (MANDATORY — create before spec file), 4. Runtime State (stateStore), After All Tests Pass, AI Fix Workflow, Collection Size Rules, Commands (+23 more)

### Community 8 - "Agent Memory"
Cohesion: 0.06
Nodes (30): Agent Memory, Bootstrap (Auto-Setup), Closed Learning Loops, Compression Rules, Compression Strategy, Context Compression (inspired by Hermes /compress), File Roles, Hooks (3 total, as wired in settings.json) (+22 more)

### Community 9 - "Nutrition & Protein Tracking (Parameterized)"
Cohesion: 0.06
Nodes (30): 1. Unit System & Demographics, 2. Dietary Profile, 2. Protein Targets (User-Defined), 3. Meal Distribution Strategy, 4. Reset Schedule, Balanced (Standard), Calculation Workflow (Dynamic), Dietary Paradigm Adjustments (+22 more)

### Community 10 - "Finance Industry Rules"
Cohesion: 0.07
Nodes (29): 10. Accessibility for Vision Impairment, 11. Trust & Security (Navy, Dark Gray), 12. Growth & Gain (Deep Green), 13. Caution & Loss (Dark Red), 14. Traditional Yet Modern, 15. Numbers Are Content, 16. Clear Instructions & Warnings, 17. Subtle Feedback on Input (+21 more)

### Community 11 - "AI Governance & Behavior"
Cohesion: 0.07
Nodes (29): 1. AI Roles & Perspectives (Core Methodology), 1. Automation Priority Table, 1. File & Folder Naming, 1. Hybrid Setup (API + Mobile), 2. Communication Protocol (Interaction Rules), 2. Element Locator Strategy (Priority Order), 2. Expert Locators Fallback, 2. Hybrid Execution Strategy (+21 more)

### Community 12 - "E-commerce Industry Rules"
Cohesion: 0.07
Nodes (28): 10. Fast, Smooth Performance, 11. Action & Energy (Orange/Red), 12. Trust & Confidence (Blue), 13. Value & Savings (Green), 14. Product-Focused Clarity, 15. Scannable Product Descriptions, 16. Trust-Building Microcopy, 17. Smooth Cart & Checkout Interactions (+20 more)

### Community 13 - "Healthcare Industry Rules"
Cohesion: 0.07
Nodes (28): 10. Calm, Minimal Aesthetic, 11. Trust & Care (Soft Blue), 12. Health & Wellness (Green), 13. Caution & Urgency (Orange/Red), 14. Clear, Accessible Fonts, 15. Patient-Friendly Language, 16. Hierarchical Information, 17. Reassuring Feedback (+20 more)

### Community 14 - "Tech & SaaS Industry Rules"
Cohesion: 0.07
Nodes (28): 10. Dense Information Display, 11. Trust & Stability (Blues), 12. Growth & Success (Greens), 13. Caution & Urgency (Reds/Oranges), 14. Sans-Serif + Monospace Combination, 15. Clear Hierarchy, 16. Readability Over Personality, 17. Consistent Font Weights (+20 more)

### Community 15 - "Test Scenario - Design Guidelines"
Cohesion: 0.07
Nodes (28): 10. Automation Requirements, 11.1 Equivalence Partitioning (EP), 11.2 Boundary Value Analysis (BVA), 11.3 Base-Choice Coverage (BC), 11.4 Multiple-Choice Coverage (MC), 11.5 State Transition (ST), 11.6 Chow W-method / Transition Tree, 11.7 Technique Selection Decision Tree (+20 more)

### Community 16 - "UI Designer"
Cohesion: 0.06
Nodes (30): Anti-Patterns (Hard Bans), Color, Command Workflows, Context Gathering (REQUIRED), Conventions, Core Capabilities, Credits, Design Direction (+22 more)

### Community 18 - "Mobile Performance"
Cohesion: 0.08
Nodes (23): Android (Macrobenchmark), Android Profiling, Android Studio Profiler, App Startup, Automated Performance Testing (CI), Common iOS Memory Issues, Common Mobile Performance Issues, Decision Framework (+15 more)

### Community 19 - "Thai Accounting Compliance (กฎหมายบัญชีไทย)"
Cohesion: 0.08
Nodes (23): 1. กฎหมายหลัก, 2. มาตรฐานบัญชีไทย, 3. หน่วยงานกำกับดูแล, 4. จรรยาวิชาชีพบัญชี (FAP Code of Ethics), 5. การรายงานต่อหน่วยงาน, 6. บทลงโทษ, DBD, Reference: Thai Accounting Compliance (กฎหมายบัญชีไทย) (+15 more)

### Community 20 - "Reasoning Engine: 4-Stage Design System Generation"
Cohesion: 0.08
Nodes (23): 161 Industry Rules, Accessibility Check (WCAG AA), BM25 Ranking, Deliverables, Example Flow, Five Search Domains, Input, Integration (+15 more)

### Community 21 - "C# / .NET Development Standards"
Cohesion: 0.09
Nodes (22): Architecture Patterns, ASP.NET Core Patterns, C# / .NET Development Standards, Clean Architecture (Recommended), Controller-Based (Preferred for large APIs), DbContext Configuration, Dependency Injection, Entity Configuration (Fluent API) (+14 more)

### Community 22 - "Postman Environment Variables Parser"
Cohesion: 0.12
Nodes (20): analyzeVar(), args, collectionIndex, detectType(), DYNAMIC_TEMP_KEYWORDS, filePath, findProjectRoot(), isDynamicTemp() (+12 more)

### Community 23 - "Tax Accounting (บัญชีภาษี)"
Cohesion: 0.09
Nodes (22): 1. ภาษีเงินได้นิติบุคคล (Corporate Income Tax - CIT), 2. ภาษีมูลค่าเพิ่ม (VAT), 3. ภาษีหัก ณ ที่จ่าย (Withholding Tax - WHT), 4. ภาษีเงินได้บุคคลธรรมชาติ (PIT), 5. ภาษีอื่นๆ, Input VAT ที่ไม่สามารถเครดิตได้, Reference: Tax Accounting (บัญชีภาษี), การคำนวณ (+14 more)

### Community 24 - "Working Capital & Internal Controls"
Cohesion: 0.09
Nodes (22): 1. การจัดการเงินสด (Cash Management), 2. บัญชีลูกหนี้ (Accounts Receivable), 3. บัญชีสินค้าคงคลัง (Inventory), 4. บัญชีเจ้าหนี้ (Accounts Payable), 5. Internal Controls (COSO Framework), 5 องค์ประกอบ, 6. Fraud Prevention, Aging Analysis (+14 more)

### Community 25 - "API Data Lessons"
Cohesion: 0.09
Nodes (21): API Data Lessons, Context, Context, Context, Context, Context, LESSON-DATA-001: 404 Not Found — Resource Missing or Wrong Endpoint, LESSON-DATA-002: 400 Bad Request — Validation Error (+13 more)

### Community 26 - "Digital Tax Systems (ระบบภาษีดิจิทัล)"
Cohesion: 0.09
Nodes (21): 1. e-Tax Invoice & e-Receipt, 2. e-Withholding Tax (e-WHT), 3. e-Filing (การยื่นแบบออนไลน์), 4. Digital Services Tax, 5. การเตรียมความพร้อมสำหรับ e-Tax, 6. แหล่งข้อมูล, Reference: Digital Tax Systems (ระบบภาษีดิจิทัล), ขั้นตอน (+13 more)

### Community 27 - "Discovery & Domain Analysis"
Cohesion: 0.10
Nodes (20): Analogical Reasoning, Deep Abstraction Protocol, Discovery & Domain Analysis, How it works, Output Format (written to file, not chat), Phase 1: Load Implementation Context, Phase 2: Index Scan (Concrete), Phase 3.1: Similar Features (In-Context Learning) (+12 more)

### Community 28 - "C/C++ Development Standards"
Cohesion: 0.10
Nodes (20): Build & Run, C++20 Additions, C/C++ Development Standards, C-Specific Notes (When Writing Pure C), CMake Test Setup, CMakeLists.txt (Modern CMake), Error Handling, Memory Safety (+12 more)

### Community 29 - "Security — Dev + QA Rules"
Cohesion: 0.10
Nodes (20): Anti-Rationalization (Dev + QA), Automation Patterns (Playwright), Dev Review Checklist, Fixture Structure + Pipeline, Input Validation, Internal Analysis (auto-run when loaded during test scenario design), Minimum Scenarios, Mobile Patterns (Robot Framework) (+12 more)

### Community 30 - "Web UI Workflow & MUI Lessons"
Cohesion: 0.10
Nodes (19): LESSON-WF-001: Multi-Outcome Click — Use Promise.race() Not isVisible(), LESSON-WF-002: Backend Transient Errors — Retry with Promise.race(), LESSON-WF-003: Check Default Values Before Adding Interaction Code, LESSON-WF-004: Debugging Workflow — Use DevTools MCP First, LESSON-WF-005: MUI Dropdown Locator Pattern, LESSON-WF-006: Test Data Minimalism, Problem, Problem (+11 more)

### Community 31 - "Playwright Testing - Global Coding Standards"
Cohesion: 0.10
Nodes (19): 1. AI Roles & Perspectives (Core Methodology), 1. Automation Priority Table, 1. Base-Choice (BC) Pattern, 1. File & Data Handling, 2. Communication Protocol (Interaction Rules), 2. Hybrid Execution Strategy, 2. Multiple-Choice (MC) Pattern — Data-Driven from Fixture, 2. Standard Helper Patterns (+11 more)

### Community 32 - "Advanced Accounting (บัญชีขั้นสูง)"
Cohesion: 0.10
Nodes (19): 1. TFRS 15 — Revenue Recognition (5-Step Model), 2. TFRS 9 — Financial Instruments, 3. TFRS 16 — Leases, 4. Business Combination (TFRS 3), 5. Consolidated Financial Statements, 6. Foreign Currency (TAS 21), Acquisition Method, ECL (Expected Credit Loss) (+11 more)

### Community 33 - "BOI Tax Incentives (สิทธิประโยชน์ BOI)"
Cohesion: 0.10
Nodes (19): 1. ภาพรวม BOI, 2. การบัญชีสำหรับกิจการ BOI, 3. เงื่อนไขการรักษาสิทธิ์, 4. การบัญชีเมื่อสิทธิ์หมดอายุ, 5. การรายงานต่อ BOI, 6. ประเภทกิจการที่ได้รับส่งเสริม (2025), Deferred Tax สำหรับกิจการ BOI, Reference: BOI Tax Incentives (สิทธิประโยชน์ BOI) (+11 more)

### Community 34 - "Supported Tech Stacks"
Cohesion: 0.10
Nodes (19): Angular, Astro, Design Token Output Format, Flutter, HTML + Tailwind CSS, Jetpack Compose, Laravel, Mobile & Native (+11 more)

### Community 35 - "Backend Code Review"
Cohesion: 0.11
Nodes (18): API Design (see `api-design.md`), Architecture, Authentication (see `authentication.md`), Backend Code Review, Checklist — All Frameworks, Database (see `database-design.md`), Django, Docker (see `docker.md`) (+10 more)

### Community 36 - "Logical Design"
Cohesion: 0.11
Nodes (18): Adapt to project type, API Field Optionality (MANDATORY), Client Application — data-testid Specification (Mandatory), Completeness checklist, Example, Format, Format, How it works (+10 more)

### Community 37 - "Task Design"
Cohesion: 0.11
Nodes (18): Artifact Output Locations (resolves the `{path}` fields below), Before Marking Complete, Critical Success Criteria, Entry Point Requirements, Mock Strategy (QA only, MANDATORY for external dependencies), Next Step, Output, Platform Routing (QA only, MANDATORY — read before creating tasks) (+10 more)

### Community 38 - "Data Auditing & Body Composition Analysis"
Cohesion: 0.11
Nodes (18): Assessment Framework: 28-Day Trend Analysis, Auto-Conversion Reference, BIA (Bioelectrical Impedance Analysis) Review Protocol, Common BIA Artifacts (Not Real Changes), Data Quality: Visual Evidence Hierarchy, Imperial System, Interpretation Rules, Key Metrics to Track (+10 more)

### Community 40 - "Frontend Performance"
Cohesion: 0.11
Nodes (18): Chrome DevTools MCP — Still Used For, Common Anti-Patterns + Fixes, Core Web Vitals Targets, Embedded HTML Report Format, Frontend Performance, Implementation Pattern, Integration with Phase 2.5, Markdown Report Format (+10 more)

### Community 41 - "Appium MCP Setup — Installation &"
Cohesion: 0.11
Nodes (18): Appium MCP Setup — Installation & Integration, Create Emulator (if needed), Enable when ready:, How It All Connects, Or manually add to mcp.json:, Prerequisites, Quick Verification, Required SDK Components (+10 more)

### Community 42 - "Cost Accounting (บัญชีต้นทุน)"
Cohesion: 0.11
Nodes (18): 1. Job Order Costing, 2. Process Costing, 3. Activity-Based Costing (ABC), 4. Standard Costing & Variance Analysis, 5. Target Costing, 6. Throughput Accounting (Theory of Constraints), Equivalent Units, Joint Products & By-Products (+10 more)

### Community 43 - "Design Patterns Library"
Cohesion: 0.07
Nodes (28): 10. Vibrant High-Energy for Viral/Social Creative Tools, 11. Bold Primaries & Artistic Freedom, 12. Dark Studio + Neon Accents, 13. AI Purple + Aurora Gradients, 14. Bold Expressive Display Type, 15. Minimal/Elegant for Portfolio & Photography, 16. Gaming & Music Impact Type, 17. Parallax & Scroll-Triggered Reveals (+20 more)

### Community 44 - "Task Progress Guide"
Cohesion: 0.11
Nodes (17): After Each Category Completes, After Each Task (Dev), Artifacts (MANDATORY), Checklist Rules, Context (MANDATORY), File Behavior, Incremental Update Rule (MANDATORY), Lessons Learnt (+9 more)

### Community 45 - "Movement, Biomechanics & Load Prescription (Unit-Aware)"
Cohesion: 0.11
Nodes (17): 1RM Calculation, Core Principles, Exercise Form Checklist, Load Prescription Workflow, Load Ranges by Goal, Pain vs. Discomfort, Part 1: Biomechanics & Movement Modification, Part 2: Strength Prediction & Load Prescription (+9 more)

### Community 47 - "Database Performance"
Cohesion: 0.11
Nodes (17): Connection Pool Tuning, Database Performance, Decision Framework, EXPLAIN — Reading Execution Plans, Finding Slow Queries, Index Optimization, K6 + Database Monitoring, Key indicators (+9 more)

### Community 49 - "Knowledge Base — Ingest & Maintenance"
Cohesion: 0.12
Nodes (16): Architecture: 2 Layers, Compound Effect, Cross-Linking Rules, Ingest Steps (for screenshots — most common), Ingest Workflow, Integration with the QA Flow, KB File Format (per-project biz), Knowledge Base — Ingest & Maintenance Guide (+8 more)

### Community 50 - "Backend Performance"
Cohesion: 0.12
Nodes (16): 2 Modes, Backend Performance, Chrome DevTools MCP — Backend Profiling, Decision Framework, MCP Tools ที่ใช้, Option A: Chrome DevTools MCP (Live — จาก Browser), Option B: Direct API Call (curl / httpie), Option C: k6 (Per-Endpoint — หลายรอบ หา p95) (+8 more)

### Community 51 - "HAR-Based Network Mocking"
Cohesion: 0.12
Nodes (16): 3-Phase Workflow, Auto-fallback: real service → HAR, Basic replay, Error cases — always use page.route() (not HAR), File Structure, HAR-Based Network Mocking, HAR vs page.route() — When to use which, Mock Strategy Decision Table (+8 more)

### Community 52 - "Robot Framework + Flutter via Appium"
Cohesion: 0.12
Nodes (16): Android, Appium Server Setup for Flutter, Build Requirements, Capabilities — Flutter Driver, Common Issues, Context Switching, Flutter Code Preparation (Dev Team), iOS (+8 more)

### Community 53 - "Financial Planning & Capital Budgeting"
Cohesion: 0.12
Nodes (16): 1. งบประมาณประจำปี (Annual Budget), 2. Capital Budgeting, 3. Cost-Volume-Profit Analysis, 4. Relevant Costing for Decisions, 5. Risk Management, Discontinuance Decision, Hedging, Make or Buy (+8 more)

### Community 54 - "Memory Decay Snapshot (2026-07-29)"
Cohesion: 0.07
Nodes (28): 10. Minimal Chrome for AI-Native Interfaces, 11. Neon on Deep Black, 12. AI Purple + Aurora Gradients, 13. Earth Green + Solar Yellow for Climate/Sustainability, 14. Futuristic Monospace/Technical Type, 15. Spatial Clear System Type, 16. Scientific/Academic Clarity, 17. Wallet-Connect & Transaction State Animations (+20 more)

### Community 55 - "Plan: Understand-Anything + Graphify Plugin Integration"
Cohesion: 0.12
Nodes (15): Current Local State, Decision, Implementation Phases, Layer 1: Graphify Core, Layer 2: Understand-Anything Experience, Layer 3: Bridge Contract, Open Questions, Phase 1: Finish Install Verification (+7 more)

### Community 56 - "English Practice — Exercise Types"
Cohesion: 0.12
Nodes (15): 10. Common Mistake Patterns (Your Recurring Errors), 1. Free Writing (Any Time), 2. Grammar Drills (Focus on One Rule), 3. Sentence Builders (Specific Context), 4. Tense Correction (Past/Present/Future), 5. Article Practice (a/an/the), 6. Conversation Scenarios (Role-Play), 7. Email/Formal Writing (Professional English) (+7 more)

### Community 57 - "Recovery, Sleep & Supplements"
Cohesion: 0.12
Nodes (15): Core Principle, HRV Readiness Scoring, Overtraining Detection, Part 1: Recovery & Sleep, Part 2: Supplement Stack, Recovery Nutrition, Reference: Recovery, Sleep & Supplements, Sleep Protocol (+7 more)

### Community 58 - "Frontend Code Review"
Cohesion: 0.12
Nodes (15): Android (Kotlin / Jetpack Compose), Architecture, Checklist — All Platforms, Environment Config (see `env-config-standards.md`), Error Handling (see `error-handling-standards.md`), Flutter, Frontend Code Review, iOS (Swift / SwiftUI) (+7 more)

### Community 59 - "Frontend Development"
Cohesion: 0.12
Nodes (15): Anti-Rationalization Table, Consistency Contract, Frontend Development, ⚠️ Gotchas, Human-in-the-Loop Points, Inline Process, LLM-Friendly Code Comments, Mobile (+7 more)

### Community 62 - "Macro & Market Context"
Cohesion: 0.12
Nodes (15): Dollar Strength (DXY), Earnings Revision Cycle, Economic Cycle → Sector Leadership, Fed Rate Cycle → Sector Impact, Growth Indicators, Inflation & Rates, Interest Rate Impact on P/E, Key Macro Indicators to Monitor (+7 more)

### Community 63 - "React Standards"
Cohesion: 0.12
Nodes (15): Component Design, Critical — Eliminating Waterfalls, Cross-Platform Standards, Folder Structure, High — Bundle Size, Hooks, Medium — Re-render Optimization, Naming (+7 more)

### Community 64 - "Memory Decay Snapshot (2026-07-26)"
Cohesion: 0.07
Nodes (28): 10. Shared Color-Coding for Family/Couple Apps, 11. Warm Streak Amber + Progress Green, 12. Calm Lavender & Midnight Pastels, 13. Nature Green + Earth Tones, 14. Playful Rounded for Habit & Family Apps, 15. Calm Wellness Serif/Sans, 16. Handwritten/Sketch for Journaling, 17. Breathing & Ambient Micro-Animations (+20 more)

### Community 65 - "Memory Decay Snapshot (2026-07-27)"
Cohesion: 0.07
Nodes (28): 10. Accessibility First for Vulnerable Users, 11. Trust Navy + Gold (Professional Services), 12. Warm Hospitality (Restaurant, Beauty, Wedding), 13. Booking-Blue + Confirm-Green (Transactional Services), 14. Formal Authority Serif/Sans, 15. Warm Editorial for Hospitality, 16. Clean Functional for Booking & Operator Tools, 17. Confirmation & Reminder Feedback (+20 more)

### Community 66 - "Skill Sync Protocol.Md Script"
Cohesion: 0.13
Nodes (14): Adding/updating a personal skill (Claude-only), Adding/updating a shared skill, Agent Sync Protocol, Full sync (all at once), Runtime Targets, Safe Update Workflow, Skill Structure (New Flat Layout), Source of Truth Hierarchy (+6 more)

### Community 67 - "Structure & Design"
Cohesion: 0.13
Nodes (15): 1. Centralized Shared Resources (Mandatory), 2. Thinking Process (CoT) - Page Object Design, 3. Page Object Model Pattern (Layout-Based Architecture), 4. Shared UI Helpers (Use Templates), 5. Categorizing Page Objects by Feature (Feature-Based), 6.1 Multi-Role Auth (Login Once per Role) 👥, 6.2 Database Fixture 🗄️, 6. Additional UI Patterns (+7 more)

### Community 68 - "Scenario Designer"
Cohesion: 0.13
Nodes (14): Effort Scale (ALL platforms: API, Web UI, Mobile UI), File & Folder Naming (MANDATORY), Format (HTML for Azure DevOps), Format Rules (for md2csv.sh compatibility), Language, Metadata (Mandatory for CSV Export), Output Format (Mandatory), PBI Header (MANDATORY — must appear at top of file before any scenario) (+6 more)

### Community 69 - "Financial Reporting & Disclosure"
Cohesion: 0.13
Nodes (14): 1. องค์ประกอบงบการเงินฉบับเต็ม, 2. งบกระแสเงินสด (Cash Flow Statement), 3 กิจกรรม, 3. หมายเหตุประกอบงบการเงิน, 4. Segment Reporting (TFRS 8), 5. ประเภทความเห็นผู้สอบบัญชี, 6. Deferred Tax (TAS 12), Key Audit Matters (KAM) (+6 more)

### Community 70 - "Core Rules"
Cohesion: 0.13
Nodes (14): Core Rules, Do, Don't, Done-gate (MANDATORY — last action before Done), Git, Git Identity by Path, Local Worktree Dirs Must Be Gitignored, Memory Protocol (+6 more)

### Community 71 - "Batch Update Skills Script"
Cohesion: 0.22
Nodes (13): add_aidlc_gate(), add_consistency_contract(), add_improvement_tracking(), add_version_to_frontmatter(), get_domain(), main(), process_file(), Add AIDLC Gate section after the first # heading. (+5 more)

### Community 72 - "LATS Simulation"
Cohesion: 0.14
Nodes (13): Architecture (API/Web UI), Evaluation Gate (Mental Walkthrough), How it works, Hybrid Selection (MANDATORY), LATS Simulation, Locator Strategy (UI only), Resilience Strategy (after hybrid selection), Rules (+5 more)

### Community 73 - "Android Native (Kotlin)"
Cohesion: 0.14
Nodes (13): Android Native (Kotlin), Architecture, Compose Navigation, Coroutines & Flow, Cross-Platform Standards, Dependency Injection, Folder Structure, Jetpack Compose (2025 Best Practices) (+5 more)

### Community 74 - "API Design"
Cohesion: 0.14
Nodes (13): API Design, Contract-First API Design, Contract-First Checklist, Error Handling, GraphQL (when applicable), gRPC (when applicable), Hyrum's Law, Response Format (+5 more)

### Community 75 - "Git Commit, Push & Pull Request"
Cohesion: 0.14
Nodes (13): Bad Commit Messages, Commit Message Examples, Git Commit, Push & Pull Request, Option A: Direct Commit to Main, Option B: Feature Branch (for PR), PR Creation, PR Rules, Prerequisites (+5 more)

### Community 76 - "API Mock Strategy Lessons"
Cohesion: 0.14
Nodes (13): API Mock Strategy Lessons, Context, Context, Context, LESSON-MOCK-001: APIRequestContext Does Not Support route() Interception, LESSON-MOCK-002: Module-Level Store Causes Parallel Test Data Leakage, LESSON-MOCK-003: In-Memory Mock DB Pattern for Tests Without Real Database, Problem (+5 more)

### Community 77 - "API Network Lessons"
Cohesion: 0.14
Nodes (13): API Network Lessons, Context, Context, Context, LESSON-NET-001: 500 Internal Server Error — System Failure, LESSON-NET-002: Request Timeout — Progressive Debugging Strategy, LESSON-NET-003: CORS Error — Use APIRequestContext Instead of page.request, Problem (+5 more)

### Community 78 - "Web UI Timing Lessons"
Cohesion: 0.14
Nodes (13): LESSON-TIME-001: Timeout Waiting for Selector, LESSON-TIME-002: Element Covered by Loading Overlay, LESSON-TIME-003: Data Not Loaded — Wait for API Response, LESSON-TIME-004: Navigation Timeout — Page Loads Slowly, Problem, Problem, Problem, Problem (+5 more)

### Community 79 - "Playwright Code Review"
Cohesion: 0.14
Nodes (13): API Tests (if applicable), Checklist, Code Quality, Database (if applicable), Locators (Critical), Performance & Reliability, Playwright Code Review, Review Process (+5 more)

### Community 80 - "Playwright Workflow"
Cohesion: 0.14
Nodes (13): 1. Code Writer, 2. Code Review, 3. Test Execution, 4. Self-Healing (Reflexion Pattern), Bug Report Template (When QA cannot self-heal), Mock data location, Mock Layer (MANDATORY — TDD Red Phase), Pattern: health check + auto-fallback (+5 more)

### Community 81 - "API Automation Architecture"
Cohesion: 0.14
Nodes (13): API Automation Architecture, Approval, Architecture pattern: Multi-Service, File structure, Key rules, LATS Forbidden Patterns, Mock-API Prefix Rule (Backend Not Ready), Process (+5 more)

### Community 82 - "Robot Framework Code Review"
Cohesion: 0.14
Nodes (13): Appium Configuration, Checklist, Code Quality, Database (if applicable), Expert Gems (Advanced), Keywords Quality, Locators (Critical — Mobile), Review Process (+5 more)

### Community 83 - "Test Scenario"
Cohesion: 0.14
Nodes (13): Anti-Rationalization, Batch Skip Guard (fires immediately on any skip signal), Full Workflow (MANDATORY for new PBI/feature — execute ALL steps in order), Gotchas, Human-in-the-Loop Points, Red Flags, Required Context, Requirements Source (before Step 1) (+5 more)

### Community 84 - "Financial Analysis (วิเคราะห์งบการเงิน)"
Cohesion: 0.14
Nodes (13): 1. อัตราส่วนสภาพคล่อง (Liquidity Ratios), 2. อัตราส่วนประสิทธิภาพ (Efficiency Ratios), 3. อัตราส่วนความสามารถชำระหนี้ (Solvency Ratios), 4. อัตราส่วนความสามารถทำกำไร (Profitability Ratios), 5. DuPont Analysis, 6. Trend Analysis, 7. EVA (Economic Value Added), 8. WACC (+5 more)

### Community 85 - "Classic Typography Principles"
Cohesion: 0.14
Nodes (13): Accessibility, Choosing Distinctive Fonts, Classic Typography Principles, Fluid Type, Font Selection & Pairing, Modern Web Typography, Modular Scale & Hierarchy, OpenType Features (+5 more)

### Community 86 - "Coding Principles"
Cohesion: 0.15
Nodes (12): 1. Think Before Coding, 2. Simplicity First, 3. Graph Before Edit, 4. Surgical Changes, 5. Goal-Driven Execution, 6. Visual Output: .md vs HTML/Artifact, 7. Workflow Fan-out Pattern Check, Changelog / Release Automation (+4 more)

### Community 87 - "Agent Memory Subagent Patterns"
Cohesion: 0.15
Nodes (12): 1. `memory-curator`, 2. `memory-bootstrapper`, 3. `knowledge-promoter`, 4. `skill-evolution-checker`, Agent Memory Subagent Patterns, Cost Guidance, Invocation Pattern, Recommended Utility Subagents (+4 more)

### Community 88 - "Python Backend"
Cohesion: 0.15
Nodes (12): Async, Cross-Language Standards, Django Structure, FastAPI Structure, Framework Choice, Official Python References, Patterns, Pydantic v2 (FastAPI 0.100+) (+4 more)

### Community 89 - "Backend Development"
Cohesion: 0.15
Nodes (12): Backend Development, Code Quality, Core, Frameworks, ⚠️ Gotchas, Human-in-the-Loop Points, Infrastructure, Inline Process (+4 more)

### Community 90 - "Fitness Skills — Local Instructions"
Cohesion: 0.15
Nodes (12): Biomechanical & Movement Principles, Composition, Data Auditing, Fitness Skills — Local Instructions, Input Conventions, Nutrition Tracking, Output Conventions, Response Format (+4 more)

### Community 91 - "Fitness Skills — Local Instructions"
Cohesion: 0.15
Nodes (12): Biomechanical & Movement Principles, Composition, Data Auditing, Fitness Skills — Local Instructions, Input Conventions, Nutrition Tracking, Output Conventions, Response Format (+4 more)

### Community 92 - "Fitness Skills — Local Instructions"
Cohesion: 0.15
Nodes (12): Biomechanical & Movement Principles, Composition, Data Auditing, Fitness Skills — Local Instructions, Input Conventions, Nutrition Tracking, Output Conventions, Response Format (+4 more)

### Community 93 - "iOS Native (Swift)"
Cohesion: 0.15
Nodes (12): Architecture, Concurrency, Cross-Platform Standards, Data Persistence, Folder Structure, iOS Native (Swift), Networking, Official Apple References (+4 more)

### Community 94 - "K6 Scripting"
Cohesion: 0.15
Nodes (12): Authentication Flow, Basic Script, Data Parameterization, Folder Structure, Groups & Tags, HTTP Requests, Installation, K6 Scripting (+4 more)

### Community 95 - "Structure & Design"
Cohesion: 0.15
Nodes (13): 1. Service Layer Pattern (Atomic Services), 2.1 Conditional Mocking (Fallback), 2.2 GraphQL Interception (By Operation Name), 2. Advanced API Mocking & Interception, 3. API Service Architecture (Multi-Service Pattern), 4.1 Multi-Role API Auth Fixture 👥, 4.2 Database Fixture (API Integration) 🗄️, 4.3 API Response Cache Fixture 📦 (+5 more)

### Community 96 - "Accessibility Testing — Playwright + axe-core"
Cohesion: 0.15
Nodes (12): Accessibility Testing — Playwright + axe-core, Basic Accessibility Scan, Best Practices, CI Integration, Common Accessibility Rules to Check, Exclude Known Issues (Temporary), Filter by WCAG Level, Playwright Accessibility Assertions (Built-in) (+4 more)

### Community 97 - "Component Testing — Playwright"
Cohesion: 0.15
Nodes (12): Basic Component Test, Best Practices, Component Testing — Playwright, Config, Run Component Tests, Setup, Testing Forms, Testing Interactions (+4 more)

### Community 98 - "Explore-to-Test Workflow"
Cohesion: 0.15
Nodes (12): Comparison: Explore Tools, Decision Matrix: Which Tool When, Explore-to-Test Workflow, Full Workflow, Integration with Existing Skills, Rules, Step 1: Explore with Chrome DevTools MCP, Step 2: Capture HAR (+4 more)

### Community 99 - "Runtime Inspection Workflow"
Cohesion: 0.15
Nodes (12): 1. Reproduce in Browser, 2. Inspect Console Errors, 3. Inspect Network Requests/Responses, 4. Inspect DOM and Accessibility Tree, 5. Check Storage/State, 6. Capture Screenshot or Trace, 7. Use Evidence to Fix, 8. Add Regression Test (+4 more)

### Community 100 - "Playwright Testing"
Cohesion: 0.17
Nodes (11): Anti-Rationalization, Bug Life Cycle Integration (GUARD state), Gotchas, Human-in-the-Loop Points, Key Rules, Playwright Testing, Red Flags, Required Context (+3 more)

### Community 101 - "Mobile Automation Architecture"
Cohesion: 0.15
Nodes (12): Approval, Architecture pattern: Page Object (Hybrid API + Mobile), File structure, Key rules, Labels File Pattern (Bi-language TH/EN), LATS Forbidden Patterns, Locator priority, Mobile Automation Architecture (+4 more)

### Community 102 - "Web UI Automation Architecture"
Cohesion: 0.15
Nodes (12): Approval, Architecture pattern: Layout-Based, Business Edge Cases (Mandatory Check), File structure, Hybrid Action Analysis (mandatory for Web UI), Key rules, LATS Forbidden Patterns, Locator priority (+4 more)

### Community 103 - "QA Architect"
Cohesion: 0.15
Nodes (12): Divider (MANDATORY — same as test scenario files):, Human-in-the-Loop Points, Inline Process, Key decisions section rules:, Next Step, Output, QA Architect, 📋 Quick Review Summary (MANDATORY — add to every architecture file) (+4 more)

### Community 104 - "Robot Framework 7.x New Features"
Cohesion: 0.15
Nodes (12): Best Practices for RF 7.x, Improved Argument Conversion, Inline IF (RF 5+), Listener API v3 (RF 7), Native JSON Support, Robot Framework 7.x New Features, Secret Variables (RF 7.4), Skip Tests Conditionally (+4 more)

### Community 105 - "Short Interest & Options Flow"
Cohesion: 0.15
Nodes (12): Integration with Stock Report, Interpretation, Key Metrics, Key Options Metrics, Options Flow Analysis, Put/Call Ratio (Stock-Specific), Reference: Short Interest & Options Flow, Search Queries (+4 more)

### Community 106 - "Transfer Pricing (ราคาโอน)"
Cohesion: 0.15
Nodes (12): 1. กฎหมายและข้อบังคับ, 2. หลักการ Arm's Length, 3. เอกสารที่ต้องจัดทำ, 4. Global Minimum Tax (Pillar Two), 5. Related Party Transactions, 6. บทลงโทษ, Local File Documentation, Master File (สำหรับ MNE ขนาดใหญ่) (+4 more)

### Community 107 - "Design Gate Hook"
Cohesion: 0.21
Nodes (8): main(), Shared helpers for PreToolUse gate hooks. Fail-open: callers catch all errors., Return True if a Skill tool_use appears in the transcript.      skill_name=None, skill_invoked(), main(), find_mandatory_skill(), main(), Return (skill_name, section_title) from the first '## ... MANDATORY ...'     sec

### Community 108 - "Gap Analysis"
Cohesion: 0.17
Nodes (11): Blocking Gap Handling, Gap Analysis, How it works, Output, Step 1: Extract Required Logic, Step 2: Match Against Domain Results, Step 3: Calculate Metrics, Step 4: Prioritize Gaps by Impact (+3 more)

### Community 109 - "Node.js Backend"
Cohesion: 0.17
Nodes (11): Cross-Language Standards, Error Handling, Framework Choice, NestJS Structure, Node.js Backend, Official Node.js References, Patterns, Project Structure (Express/Fastify) (+3 more)

### Community 110 - "DevOps Pipeline"
Cohesion: 0.17
Nodes (11): Critical Constraints, DB Strategy Injection, Defaults (auto-applied unless user specifies otherwise), DevOps Pipeline, Naming, Path Resolution, Pipeline Templates, Required Questions (ask one at a time) (+3 more)

### Community 112 - "Playwright API Testing - Rules &"
Cohesion: 0.17
Nodes (11): 1. Global Authentication (Storage State), 2. Parallel Execution Strategy, 3. CI/CD Optimization, Auth / Token Rules, ✅ DO's, ❌ DON'Ts, PART 10: Performance & Reliability, PART 11: CLI Commands & Execution (Quick Commands) (+3 more)

### Community 113 - "Infrastructure & Scripts Standard (package.json)"
Cohesion: 0.17
Nodes (12): 1. Environment Variables, 2. Configuration File, 3. Test Directory, 4. Mode Options, ✅ Correct Script Examples, 📝 Format Components, 🚨 Generation Requirements, MANDATORY Requirements (+4 more)

### Community 114 - "Infrastructure & Scripts Standard (package.json)"
Cohesion: 0.17
Nodes (12): **1. Environment Variables**, **2. Configuration File**, **3. Test Directory**, **4. Mode Options**, ✅ Correct Script Examples, 📝 Format Components, 🚨 Generation Requirements, **MANDATORY Requirements:** (+4 more)

### Community 115 - "Playwright Recorder Analyzer"
Cohesion: 0.17
Nodes (11): Extraction Checklist, Form Filling, Hard Waits, Locator priority, Pattern Transformations, Playwright Recorder Analyzer, Process, Record First (+3 more)

### Community 116 - "Visual Regression Testing — Playwright"
Cohesion: 0.17
Nodes (11): Basic Screenshot Comparison, Best Practices, CI Integration, Cross-Browser Visual Testing, Folder Structure, Masking Dynamic Content, Multi-Viewport Testing, Playwright Config for Screenshots (+3 more)

### Community 117 - "Portfolio & ETF Analysis — Investment"
Cohesion: 0.17
Nodes (11): Critical Rules, Mode Detection, Output Format — ETF Sections (9–15), Output Format — Portfolio Sections (1–8), Persona & Focus, Portfolio & ETF Analysis — Investment Review, Safety & Disclaimer, Step 1 — Collect Input (+3 more)

### Community 118 - "Robot Framework Browser Library (Playwright-Powered)"
Cohesion: 0.17
Nodes (11): Assertions, Auto-Wait (Key Advantage over Selenium), Basic Usage, Installation, Locator Strategies, Network Interception (Mock API), Page Object Pattern with Browser Library, Parallel Execution (+3 more)

### Community 119 - "Robot Framework Testing"
Cohesion: 0.17
Nodes (11): Anti-Rationalization Table, Consistency Contract, Human-in-the-Loop Points, Inline Process, Property-based Testing Pattern (Hypothesis), Red Flags, Required Context, Robot Framework Testing (+3 more)

### Community 120 - "Persona & Focus"
Cohesion: 0.17
Nodes (11): Complete Workflow, Critical Rules (MANDATORY), Language & Tone, Output Format — 20 Sections (Template), Persona & Focus, Reference Loading Guide, Safety & Disclaimer, Step 1 — Receive Ticker (+3 more)

### Community 121 - "HTML Report Structure"
Cohesion: 0.17
Nodes (11): Design System, HTML Report Structure, Section 1 — Snapshot Table, Section 2 — Revenue and Net Income, Section 3 — EPS Deep Dive, Section 4 — Valuation, Section 5 — Dividend Snapshot, Section 6 — News, MD&A and Guidance (+3 more)

### Community 122 - "Color & Contrast"
Cohesion: 0.17
Nodes (11): Alpha Is A Design Smell, Building Functional Palettes, Color & Contrast, Color Spaces: Use OKLCH, Contrast & Accessibility, Dangerous Combinations, Dark Mode, Palette Structure (+3 more)

### Community 123 - "Spatial Design"
Cohesion: 0.17
Nodes (11): Cards Are Not Required, Container Queries, Depth & Elevation, Grid Systems, Hierarchy Through Multiple Dimensions, Optical Adjustments, Spacing Systems, Spatial Design (+3 more)

### Community 124 - "Core Mental Model"
Cohesion: 0.17
Nodes (11): Caching Strategy, Core Mental Model, Data Fetching, Folder Structure (Production), Middleware, Next.js 15 — App Router & Server Components, React 19 Hooks in Next.js, Route Handlers (API Routes) (+3 more)

### Community 125 - "Headroom — Context Compression for AI"
Cohesion: 0.18
Nodes (11): Agent Compatibility, Architecture, Core Commands, Cross-Agent Memory, Headroom — Context Compression for AI Agents, headroom learn (auto-improve CLAUDE.md), MCP Server, Routing Table (+3 more)

### Community 126 - "Skill Routing"
Cohesion: 0.13
Nodes (14): Browser Automation Tool Priority, Chained Routes Run to Completion, Claude Code Plugin vs Portable Skill, Continuation, Cross-Project Stack Detection, Kouen Task Sync (Kouen's own Task Dashboard → a real project plan), Mid-Chain Re-Routing, Principle (+6 more)

### Community 127 - "Algorithm of Thought (AoT)"
Cohesion: 0.18
Nodes (10): Algorithm of Thought (AoT), Comparison with Other Techniques, Example, How it works, Key Principles, Phase 1: Define the Search Space, Phase 2: Explore (DFS-style), Phase 3: Evaluate & Select (+2 more)

### Community 128 - "Error Handling Standards — Backend"
Cohesion: 0.18
Nodes (10): Error Code Convention, Error Handling Standards — Backend (All Languages), Error Response Format (All Services), HTTP Status Code Mapping, Node.js (Express), Node.js (NestJS), Platform Implementation, Python (Django REST Framework) (+2 more)

### Community 129 - "Domain Decomposition (DDD Strategic Design)"
Cohesion: 0.18
Nodes (10): Additional Output (Microservices), Decision: Sync vs Async, Design-Domain Alignment Check (MANDATORY เมื่อมี UX/UI design), Domain Decomposition (DDD Strategic Design), Failure Handling (if choosing Async), How it works, Integration Pattern Decision (MANDATORY for Microservices), Output (+2 more)

### Community 130 - "Security Scanning in CI/CD"
Cohesion: 0.18
Nodes (10): CodeQL — Static Analysis (SAST), Full DevSecOps Pipeline Pattern, Gitleaks — Secret Detection, Rules, Scanning Types, Security Scanning in CI/CD, Semgrep — Fast SAST (no build needed), Severity Policy (+2 more)

### Community 131 - "DevOps Pipeline"
Cohesion: 0.18
Nodes (10): Anti-Rationalization Table, Consistency Contract, DevOps Pipeline, Human-in-the-Loop Points, Inline Process, Red Flags, Required Context, Self-Learning (+2 more)

### Community 132 - "Environment Config Standards — All Platforms"
Cohesion: 0.18
Nodes (10): Android (Kotlin), Environment Config Standards — All Platforms, Environments, Flutter, iOS (Swift), Key Naming Convention, Platform Implementation, React / Web (+2 more)

### Community 133 - "Testability Standards — Test Identifier"
Cohesion: 0.18
Nodes (10): Android (Compose), Flutter, i18n / Bi-language (TH/EN), iOS (SwiftUI), Naming Convention (All Platforms), Platform Implementation, React / Web, Rules (+2 more)

### Community 135 - "Web UI Locator Strategy Lessons"
Cohesion: 0.18
Nodes (10): LESSON-UI-001: Replace CSS ID Selectors with getByRole for Button Locators, LESSON-UI-002: Use filter({ hasText }) Instead of nth()/first(), LESSON-UI-003: Inline HTML Mock via page.setContent(), Problem, Problem, Problem, Solution, Solution (+2 more)

### Community 136 - "Performance Testing"
Cohesion: 0.18
Nodes (10): Anti-Rationalization Table, Consistency Contract, Human-in-the-Loop Points, Inline Process, Performance Testing, Red Flags, Required Context, Self-Learning (+2 more)

### Community 137 - "Advanced Contract Testing (Gems)"
Cohesion: 0.18
Nodes (11): 1. AJV Schema Validation (Full Body Contract), 2. Time Manipulation (Clock Mocking), 3. API Performance Assertions (Efficiency Gem), 3. JSDoc Template, 3. Schema Validation, 4. Logging Template, 🔄 API Error Workflow (CoT), Issue 2: Rate Limiting (+3 more)

### Community 138 - "Playwright UI Testing - Rules &"
Cohesion: 0.18
Nodes (10): ✅ DO's, ❌ DON'Ts, File Structure, Helper Creation Guidelines, Login / Auth Rules, PART 11: CLI Commands & Execution (Quick Commands), PART 12: Quick Reference, PART 7: HELPERS (+2 more)

### Community 139 - "Test Scenario - CSV Export Rules"
Cohesion: 0.18
Nodes (10): 1. CSV Format, 2. 23 Columns, 3. Data Handling Rules, 4. PBI Row Rules, 5. Test Scenario Row Rules, 6. Sprint Tag Rules, 7. Validation Checklist, 8. Export Process (+2 more)

### Community 140 - "General Accounting (บัญชีทั่วไป)"
Cohesion: 0.18
Nodes (10): 1. การบันทึกรายการ (Journal Entries), 2. การจัดสรรค่าใช้จ่าย (Cost Allocation), 3. Bank Reconciliation, 4. ระบบเอกสาร, 5. Period-End Procedures, Reference: General Accounting (บัญชีทั่วไป), รายการพิเศษ, รายได้และค่าใช้จ่าย (+2 more)

### Community 141 - "Color Palettes Index (161 Total)"
Cohesion: 0.12
Nodes (24): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+16 more)

### Community 142 - "@design-system Skill"
Cohesion: 0.18
Nodes (10): 1. Invoke the Skill, 2. Provide Project Context, 3. Get Your Design System, Core Capabilities, @design-system Skill, Directory Structure, Features, Next Steps (Remaining Rules) (+2 more)

### Community 143 - "Interaction Design"
Cohesion: 0.18
Nodes (10): Destructive Actions: Undo > Confirm, Dropdown Positioning, Focus Rings, Form Design, Interaction Design, Keyboard Navigation, Loading States, Modals: The Inert Approach (+2 more)

### Community 144 - "XCTest — macOS Swift Testing"
Cohesion: 0.18
Nodes (10): Anti-Patterns, Layer Boundary — XCTest vs Robot, Minimal Runnable Check (ponytail rule), Reference, Running, Swift 6 Test Patterns, Testability Rule for HarnessApp Models, Trigger (+2 more)

### Community 145 - "1. Find the marketplace name"
Cohesion: 0.20
Nodes (10): 1. Find the marketplace name, 2. Clone repo to marketplaces dir (dir name MUST match marketplace name), 3. Get version + commit SHA, 4. Copy plugin to cache (dir name MUST match marketplace name), 5. Create .claude-plugin/plugin.json in BOTH locations, 6. Register in known_marketplaces.json, 7. Register in installed_plugins.json, 8. Enable the plugin (CRITICAL — all plugins start disabled) (+2 more)

### Community 146 - "Context Analysis"
Cohesion: 0.20
Nodes (9): Context Analysis, How it works, Output, Phase 1: Step-Back (Zoom Out First), Phase 2: Structured Extraction, Phase 3: Conflict Check, Phase 4: Write to File (MANDATORY — DO NOT SKIP), Tips (+1 more)

### Community 147 - "Logging Standards — Backend (All Languages)"
Cohesion: 0.20
Nodes (9): Log Levels, Logging Standards — Backend (All Languages), Node.js — Winston, Platform Implementation, Python — structlog / logging, Request ID (Mandatory), Rules, Security Rules (+1 more)

### Community 148 - "Domain Design (DDD Tactical Design)"
Cohesion: 0.20
Nodes (9): Additional Output (append to Business Rules), Concurrency Rules (MANDATORY for shared resources), Decision: Optimistic vs Pessimistic Locking, Domain Design (DDD Tactical Design), Example, How it works, Output per bounded context, Rules (+1 more)

### Community 149 - "Test-Driven Development (TDD)"
Cohesion: 0.20
Nodes (9): Anti-patterns to avoid, Guidelines, Process, TDD with existing code, Test-Driven Development (TDD), Test structure (Arrange-Act-Assert), The Cycle: Red → Green → Refactor, When to use (+1 more)

### Community 150 - "Operating Rules"
Cohesion: 0.20
Nodes (9): 7 Detection Categories (detail → detection-checklist.md), Anti-Patterns, Find Mismatch — Systematic Bug Detection + Bug Life Cycle, Integration with the Dev Flow, Invoke, Operating Rules, Self-Learning, Verification (+1 more)

### Community 151 - "Fitness Coach"
Cohesion: 0.20
Nodes (9): Conversation Flow by User Intent, Fitness Coach, Intent 1: Direct Training Plan Request, Intent 2: Nutrition Query, Intent 3: Movement Correction, Intent 4: Body Composition Review, Intent 5: General Fitness Knowledge, Personal Context First (+1 more)

### Community 152 - "Hook Creator Graph Report Update.Kiro.Hook Reference"
Cohesion: 0.20
Nodes (9): description, disabled, name, then, prompt, type, version, when (+1 more)

### Community 153 - "Hook Creator Phase Gate Enforcer.Kiro.Hook Reference"
Cohesion: 0.20
Nodes (9): description, name, then, prompt, type, version, when, toolTypes (+1 more)

### Community 154 - "Hook Creator Setup Agent Memory.Kiro.Hook Reference"
Cohesion: 0.20
Nodes (9): description, name, then, command, timeout, type, version, when (+1 more)

### Community 155 - "Industry Rules (81 Total)"
Cohesion: 0.20
Nodes (9): Anti-Pattern Check, By Industry File, Cross-Industry Pattern, Industry Rules (161 Total), Quick Lookup, Rule Structure, Sectors, Single Industry (+1 more)

### Community 156 - "Japanese Practice — Exercise Types"
Cohesion: 0.20
Nodes (9): 1. Free Writing (Any Time), 2. Sentence Builders (Grammar Focus), 3. Translation Practice (English/Thai → Japanese), 4. Conversation Scenarios (Role-Play), 5. Reading Comprehension (Kanji Focus), 6. Kanji Drill (Recognition & Writing), 7. Particle Practice (Grammar Deep-Dive), Homework (+1 more)

### Community 157 - "Japanese Practice — Grammar Patterns Reference"
Cohesion: 0.20
Nodes (9): Common Error Examples (From Sessions), Japanese Practice — Grammar Patterns Reference, Kanji Reading Guide, Mistake: Mixed request pattern, Pattern 1: ～てくれませんか (Can you [do this] for me?), Pattern 2: ～くださいませんか (Could you please [do this]?), Pattern 3: ～てもらえますか (Can I get you to [do this]?), Polite Request Forms (+1 more)

### Community 158 - "API Validation Lessons"
Cohesion: 0.20
Nodes (9): API Validation Lessons, Context, Context, LESSON-VAL-001: Mock Database for Demo/POC Environments, LESSON-VAL-002: Environment vs Code Logic Error — Know When NOT to Heal, Problem, Problem, Solution (+1 more)

### Community 159 - "L-MOB-004: Mobile Infrastructure & Session Stability"
Cohesion: 0.20
Nodes (9): 1. Smart Reset Strategy, 2. Explicit Teardown, 3. Hide Keyboard Pattern, 4. Appium Health Check (CI), AI Instruction, Context, L-MOB-004: Mobile Infrastructure & Session Stability, Problem (+1 more)

### Community 160 - "Helper Creation Guidelines"
Cohesion: 0.20
Nodes (10): 1. Response Validation Helper, 2. Mock Data Generator, 3. API Test Helper, API-Specific Helper Patterns, File Structure, Helper Creation Guidelines, JSDoc Template, Logging Template (+2 more)

### Community 161 - "Quick Automation"
Cohesion: 0.20
Nodes (9): Decision Tree, Escalation Message, Full workflow triggers, Phase 1 — File State Check, Phase 2 — Scope Check (read actual code first), Platform Compliance, Process (Quick Mode), Quick Automation (+1 more)

### Community 162 - "Test Data Generation"
Cohesion: 0.20
Nodes (9): Output Format, Process, Rules, Step 1.5: Dependency Analysis, Step 1: Analyze & Collect Data, Step 2: Generate ALL Test Data (single batch), Test Data Generation, Validation Requirements (+1 more)

### Community 163 - "Workflow: 8-Step Orchestration"
Cohesion: 0.20
Nodes (9): Step 1 — Intake and Scope Lock, Step 2 — Data Gathering (Live Web Search), Step 3 — Analyst Team (Parallel Lenses), Step 4 — Research Debate (Bull vs Bear) + Research Manager, Step 5 — Trader Proposal, Step 6 — Risk Manager Gate, Step 7 — Portfolio Manager Final Decision, Step 8 — Decision Log (Session-Level) (+1 more)

### Community 164 - "Figma & UI Analysis"
Cohesion: 0.20
Nodes (9): Figma & UI Analysis, How it works, Output, Step 1: Check for Visual Context, Step 2: Analyze Context, Step 3: Extract Details & Visual Mapping, Visual Error & Edge Simulation, Visual-to-Business Rules Mapping Table (+1 more)

### Community 165 - "Verification Loop"
Cohesion: 0.20
Nodes (9): Anti-Rationalization, Load Right Reference, Quick Reference, Red Flags, Report Format, Rules, Self-Learning, Verification (+1 more)

### Community 166 - "User Flow Generator — Mermaid from"
Cohesion: 0.22
Nodes (8): Command, Flow Types (create only when needed), Mermaid Nodes, Output Format, Output Template, Process, Rules, User Flow Generator — Mermaid from Requirements

### Community 167 - "Self-Review Rubric"
Cohesion: 0.22
Nodes (8): Anti-Patterns, Review Fork Constraints, Save/Discard Rubric (for drafts), Self-Review Rubric, Skill Flag Rubric, Skill Improvement Rubric, What Gets Reviewed, When This Runs

### Community 168 - "appium-mcp Setup"
Cohesion: 0.22
Nodes (8): 1. `"command": "npx"` alone will not resolve, 2. `timeout` is milliseconds, not seconds, After any mcp.json edit, appium-mcp Setup (Kiro / other MCP clients), Config location (Kiro), Debugging a "connection failed" with no visible error in the UI, Full working entry, Two GUI-app gotchas that cause silent connection failures

### Community 169 - "Database Design"
Cohesion: 0.22
Nodes (8): Database Design, Database Types, Indexing, Migrations, Naming, Query Patterns, Schema Design, Tips

### Community 170 - "Environment Config Standards — Backend"
Cohesion: 0.22
Nodes (8): Environment Config Standards — Backend (All Languages), Environments, Key Naming Convention, Node.js, Platform Implementation, Python (FastAPI — pydantic-settings), Rules, What Goes Where

### Community 171 - "Input Validation Standards — Backend"
Cohesion: 0.22
Nodes (8): Input Validation Standards — Backend (All Languages), Node.js — NestJS (class-validator), Node.js — Zod, Platform Implementation, Python — Django REST Framework, Python — FastAPI (Pydantic), Rules, Validation Rules

### Community 172 - "Detection Checklist (7 Categories)"
Cohesion: 0.22
Nodes (8): 1. Cross-Boundary Contract Mismatches, 2. Serialization & Encoding Gaps, 3. Logic Bugs, 4. Property & Method Access Errors, 5. Async & Concurrency Bugs, 6. Placeholder & Stub Code, 7. Language-Specific Checks, Detection Checklist (7 Categories)

### Community 173 - "Hook Creator Aidlc Gate Check.Kiro.Hook Reference"
Cohesion: 0.22
Nodes (8): description, name, then, prompt, type, version, when, type

### Community 174 - "Hook Creator Eval Check.Kiro.Hook Reference"
Cohesion: 0.22
Nodes (8): description, name, then, prompt, type, version, when, type

### Community 175 - "Hook Creator Session Save.Kiro.Hook Reference"
Cohesion: 0.22
Nodes (8): description, name, then, prompt, type, version, when, type

### Community 176 - "Hook Creator Skill Improve.Kiro.Hook Reference"
Cohesion: 0.22
Nodes (8): description, name, then, prompt, type, version, when, type

### Community 177 - "Domain Modeling"
Cohesion: 0.22
Nodes (8): Challenge against the glossary, Cross-reference with code, Domain Modeling, During a session, GLOSSARY.md — strict glossary only, Record the decision — offer sparingly, Sharpen fuzzy language, Update GLOSSARY.md inline — never batch

### Community 178 - "SwiftUI Reference"
Cohesion: 0.22
Nodes (8): App Structure, Lifecycle, Navigation, Previews, Review Checks, State and Data Flow, SwiftUI Reference, View Composition

### Community 179 - "Japanese Language Practice Skill"
Cohesion: 0.22
Nodes (8): Example, How It Works, Japanese Language Practice Skill, Load Right Reference, Practice Modes, Response Format, Script Support, Shared Practice History (Hanashi)

### Community 182 - "L-MOB-003: Reliable Mobile Gestures"
Cohesion: 0.22
Nodes (8): 1. Use Percentage-Based Swiping, 2. Implement a Scroll-Limit, 3. Handle Overlay & Sticky Headers, AI Instruction, Context, L-MOB-003: Reliable Mobile Gestures (Scrolling & Swiping), Problem, Solution: Percentage-Based Gestures

### Community 183 - "L-MOB-002: Cross-Platform Locator Strategy"
Cohesion: 0.22
Nodes (8): 1. Unified Locator Priority, 2. Smart XPath Pattern, 3. Page Object Encapsulation, AI Instruction, Context, L-MOB-002: Cross-Platform Locator Strategy, Problem, Solution: AccessibilityId-First

### Community 184 - "L-MOB-001: UI Synchronization"
Cohesion: 0.22
Nodes (8): 1. Wait Until Clickable, 2. Post-Action Verification, 3. Handle Animations, AI Instruction, Context, L-MOB-001: UI Synchronization (UI Slower than Code), Problem, Solution: Wait-Action-Verify

### Community 185 - "K6 Results Analysis"
Cohesion: 0.22
Nodes (8): Decision Framework, Grafana Dashboard (Local), Identifying Bottlenecks, JSON Output Analysis, K6 Results Analysis, Key Metrics, Reading K6 Terminal Output, Trend Analysis (Compare Runs)

### Community 186 - "Test Naming Conventions"
Cohesion: 0.22
Nodes (9): Default Testcase ID Format, 📝 Describe Format Rules, Multiple ID IDs, Multiple Testcase IDs, PART 3: Test Naming Conventions, Single ID ID, Single Testcase ID, 🏷️ Test Describe Naming Conventions (+1 more)

### Community 187 - "Playwright Database Writer"
Cohesion: 0.22
Nodes (8): Brownfield DB Strategy, Forbidden Patterns, Playwright Database Writer, Rules, Steps, When to use, กฎ Brownfield, ปัญหา

### Community 188 - "Test Database Strategy"
Cohesion: 0.22
Nodes (8): File Structure, Mocking Fallback, Phase 0: Reuse Check (before Phase 1), Phase 1: Requirements Discovery (ask user once, skip if Phase 0 found an existing file), Phase 2: Architecture Design (autonomous, no user questions), Schema Consistency Check, Standards, Test Database Strategy

### Community 189 - "Review Personas"
Cohesion: 0.22
Nodes (8): Fan-Out Pattern (Pre-Merge Gate), Human-in-the-Loop Points, Integration with the Dev Flow, Load the Right Persona, Orchestration Rules, Review Personas, Self-Learning, Verification

### Community 190 - "Robot Framework Workflow"
Cohesion: 0.22
Nodes (8): 1. Code Writer, 2. Code Review, 3. Test Execution, 4. Self-Healing (Reflexion Pattern), 5. Python Database Writer, Reflexion Log — Write to Audit Trail (MANDATORY), Robot Framework Workflow, Test Results — Write to Audit Trail (MANDATORY)

### Community 191 - "Thai Accountant Skills — Local Instructions"
Cohesion: 0.22
Nodes (8): Input Conventions, Output Conventions, Professional Boundaries, Recommended Composition, Routing Guide, Scope, Thai Accountant Skills — Local Instructions, Which Markdown To Use

### Community 192 - "Thai Accountant Skills — Local Instructions"
Cohesion: 0.22
Nodes (8): Input Conventions, Output Conventions, Professional Boundaries, Recommended Composition, Routing Guide, Scope, Thai Accountant Skills — Local Instructions, Which Markdown To Use

### Community 193 - "Thai Accountant Skills — Local Instructions"
Cohesion: 0.22
Nodes (8): Input Conventions, Output Conventions, Professional Boundaries, Recommended Composition, Routing Guide, Scope, Thai Accountant Skills — Local Instructions, Which Markdown To Use

### Community 194 - "Extract Flow"
Cohesion: 0.22
Nodes (8): Extract Flow, Never, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 195 - "Responsive Design"
Cohesion: 0.22
Nodes (8): Breakpoints: Content-Driven, Detect Input Method, Not Just Screen Size, Layout Adaptation, Mobile-First, Responsive Design, Responsive Images, Safe Areas, Testing

### Community 196 - "UX Writing"
Cohesion: 0.22
Nodes (8): Accessibility, Button Labels, Consistency, Empty States, Error Messages, Translation, UX Writing, Voice vs Tone

### Community 197 - "Verification Steps"
Cohesion: 0.22
Nodes (8): Dev Flow Integration, Failure Handling, Step 1: Build Check, Step 2: Lint Check, Step 3: Test Execution, Step 4: Coverage Check (if applicable), Step 5: Security Scan (for auth/input/API code), Verification Steps

### Community 198 - "Swift 6 XCTest Reference"
Cohesion: 0.22
Nodes (8): Async Tests, Isolating from SessionCoordinator / NSApp, @MainActor Tests, Naming Convention, Package.swift — Adding a Test Target, Swift 6 XCTest Reference, Task.detached in Production Code, Testing @Observable Models

### Community 199 - "Agent Memory Index"
Cohesion: 0.15
Nodes (8): Agent Memory Index, Knowledge, Plans, Archived Decisions (settled > 30 days, no longer "active"), Active Patterns, English Grammar Patterns — Vit, Notes, Session Log

### Community 200 - "Ponytail — Lazy Senior Dev Mode"
Cohesion: 0.25
Nodes (8): Activation, Benchmark (agentic, real Claude Code sessions), Install (already done), Modes, ponytail: comment, Ponytail — Lazy Senior Dev Mode, The Ladder (core rule), What it does

### Community 201 - "Claude Agent Workspace — ~/.claude"
Cohesion: 0.25
Nodes (7): Claude Agent Workspace — ~/.claude, Graphify, Infrastructure, Maintenance Scripts, Memory Lifecycle, Session End, Session Start

### Community 202 - "PRODUCT.md / DESIGN.md Convention"
Cohesion: 0.25
Nodes (7): Authoring, How skills use these files, Known instances, PRODUCT.md / DESIGN.md Convention, Qualifying projects, Staying in sync, What each file is

### Community 203 - "Memory Vector Search Script"
Cohesion: 0.46
Nodes (7): build_index(), collect_files(), load_index(), main(), Path, save_index(), search()

### Community 204 - "Setup/Script Readme.Md Script"
Cohesion: 0.25
Nodes (7): All Scripts, Architecture, Hooks copied to the new project, How to Use, scripts/setup — Setup Scripts, Skill Auto-Improvement System, 🚀 Start Here — Main Entry Point

### Community 205 - "Chain of Thought (CoT)"
Cohesion: 0.25
Nodes (7): Chain of Thought (CoT), How it works, Pattern 1: Architecture Decomposition, Pattern 2: Test Scenario Design, Rules, Tips, When to use

### Community 206 - "Modern C and C++ Reference"
Cohesion: 0.25
Nodes (7): CMake Rules, Language Rules, Modern C and C++ Reference, Official Documentation Anchors, Review Checklist, Safety Rules, Testing and Verification

### Community 207 - "Modern C# and .NET Backend Reference"
Cohesion: 0.25
Nodes (7): API Rules, EF Core Rules, Modern C# and .NET Backend Reference, Official Documentation Anchors, Review Checklist, Runtime Rules, Testing

### Community 208 - "Modern Node.js Backend Reference"
Cohesion: 0.25
Nodes (7): Fetch and Network, HTTP and Framework Rules, Modern Node.js Backend Reference, Official Documentation Anchors, Review Checklist, Runtime Rules, Testing

### Community 209 - "When to Load Each Reference"
Cohesion: 0.25
Nodes (7): Anti-Rationalization Table, Architect, Inline Process, Next Step, Output, Red Flags, When to Load Each Reference

### Community 210 - "English Practice — Grammar Patterns Reference"
Cohesion: 0.25
Nodes (7): Articles (a/an/the), Cause-Effect Sentences, English Practice — Grammar Patterns Reference, Gerunds (-ing) vs Infinitives (to + verb), Past Tense, Present Perfect (have + past participle), Thai Speaker Challenges

### Community 211 - "English Practice — Conversation Scenarios"
Cohesion: 0.25
Nodes (7): 1. Code Review Meeting, 2. Job Interview, 3. Team Standup, 4. Technical Discussion, 5. Casual Office Chat, 6. Asking for Help, English Practice — Conversation Scenarios

### Community 212 - "English Grammar Practice Skill"
Cohesion: 0.25
Nodes (7): English Grammar Practice Skill, Example, Format, Instructions for Claude / All Agents, Load Right Reference, Practice Modes, Shared Practice History (Hanashi)

### Community 213 - "Bug Life Cycle + Output Format"
Cohesion: 0.25
Nodes (7): Bug Life Cycle + Output Format, Classification Rules, Classify Tags (assign at CLASSIFY, carry through the tracker), Human-in-the-Loop Points, Lifecycle States, Output Format, Severity

### Community 214 - "Industry Rules (81 Total)"
Cohesion: 0.25
Nodes (7): Anti-Pattern Check, Cross-Industry Pattern, Industry Rules (161 Total), Quick Lookup, Rule Structure, Single Industry, Usage

### Community 215 - "Scale (auto-detect)"
Cohesion: 0.25
Nodes (7): 3 Amigos — Multi-Role Review, Dev Perspective, Input, Output, PO Perspective, QA Perspective, Scale (auto-detect)

### Community 216 - "Interview Doc"
Cohesion: 0.25
Nodes (7): Interview Doc, Step 1 — Load Context First, Step 2 — Interview (ONE question at a time), Step 3 — Cross-Reference Every Claim, Step 4 — Sharpen Language, Step 5 — Update Docs Inline (never batch), Summary Format

### Community 217 - "SwiftData Reference"
Cohesion: 0.25
Nodes (7): Change History, Default Rule, Model Rules, Query and Cache Rules, Review Checks, SwiftData Reference, Testing

### Community 219 - "Web UI Visibility Lessons"
Cohesion: 0.25
Nodes (7): LESSON-VIS-001: Element Not Visible — Hidden by CSS or Not Yet Loaded, LESSON-VIS-002: Element Is Disabled — Fill Required Fields Before Clicking, Problem, Problem, Solution, Solution, Web UI Visibility Lessons

### Community 220 - "K6 CI/CD Integration"
Cohesion: 0.25
Nodes (7): Azure DevOps Pipeline, GitHub Actions, Grafana Cloud K6 (Optional — for team dashboards), K6 CI/CD Integration, Performance Gate Pattern, Rules, When to Run Performance Tests

### Community 221 - "Assertions & Error Handling"
Cohesion: 0.25
Nodes (8): 1.1 Assertions Best Practices, 1.2 API Response Validation, 1. API Response Assertions, 2. 🚨 Common API Issues (Root Cause), Issue 1: Network Timeout, Issue 2: Eventual Consistency (Data not ready), Issue 3: Concurrent Request Testing (Race Conditions), PART 5: Assertions & Error Handling

### Community 222 - "Performance & Reliability"
Cohesion: 0.25
Nodes (8): 1. Global Setup (Authentication State), 2. Parallel Execution Strategy, 3. CI/CD Insight, 4.1 Worker-Scoped Fixtures (Fast Setup), 4.2 Automatic Fixtures (Global Diagnostic), 4.3 API-First Authentication (High-Speed Auth), 4. Advanced Fixtures (Technical Templates), PART 9: Performance & Reliability

### Community 223 - "Interactions & Assertions"
Cohesion: 0.25
Nodes (8): 1. UI Interaction Patterns, 2. Best Practices for UI Verification (Assertions), 3. 🚨 Common Timeout Issues (Root Cause), Issue 1: Loading Overlay/Dialog Overlapping Element, Issue 2: Data Loading (API Response Pending), Issue 3: Element is Disabled, PART 6: Interactions & Assertions, 🔄 Timeout Error Workflow (CoT)

### Community 224 - "Test Naming Conventions"
Cohesion: 0.25
Nodes (8): Default Testcase ID Format, Multiple ID IDs, Multiple Testcase IDs, PART 3: Test Naming Conventions, Single ID ID, Single Testcase ID, 🏷️ Test Describe Naming Conventions, 🔑 Testcase ID Requirements

### Community 225 - "Portfolio Risk Metrics — Reference"
Cohesion: 0.25
Nodes (7): Concentration Red Flags, Core Metrics, Correlation Interpretation, ETF Quality Checklist, Portfolio Risk Metrics — Reference, Rebalancing Triggers, Sector Weights — S&P 500 Reference (2025)

### Community 226 - "Thai Market Context — Portfolio Reference"
Cohesion: 0.25
Nodes (7): FX Impact (USD/THB), Key Thai Market Indices, Recommended Data Sources, SET vs US Market Comparison, Thai Market Context — Portfolio Reference, Thai Tax-Advantaged Funds, Withholding Tax on US Dividends

### Community 227 - "Postman → Playwright Migration Progress"
Cohesion: 0.25
Nodes (7): 📊 Postman → Playwright Migration Progress, Shared Files, Step 1+2: JSON → Markdown (USER runs in terminal), Step 2.5: AI Design Structure, Step 3: Markdown → Playwright (AI generates), Step 4: Run Tests → Fix Failures (USER runs, AI fixes), Summary

### Community 228 - "Tsconfig.Json Script"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, module, moduleResolution, skipLibCheck, strict, target

### Community 229 - "CSV Validator"
Cohesion: 0.25
Nodes (7): 23-Column Enforcement, Auto-Fix Actions, CSV Validator, Process, Scripts, Validation Rules, When to use

### Community 230 - "Test Scenario Reuse Analysis"
Cohesion: 0.25
Nodes (7): Abstract Test Pattern Protocol, Part 1: Test Pattern Matching, Part 2: Gap & Adaptation Strategy, Process, Rules, Test Scenario Reuse Analysis, When to use

### Community 231 - "Motion Design"
Cohesion: 0.25
Nodes (7): Duration: The 100/300/500 Rule, Easing, Motion Design, Only Animate transform and opacity, Perceived Performance, Reduced Motion (NOT optional), Staggered Animations

### Community 232 - "Ticket types"
Cohesion: 0.25
Nodes (7): Charting (one session — plan only, don't resolve tickets yet), Rules, Ticket types, Tracker, Wayfinder, When to use, Working through (repeat across sessions)

### Community 233 - "Skills to Evaluate (2026-07-25)"
Cohesion: 0.09
Nodes (22): 1. Surface (color), 2. Type, 3. Structure (pattern), 4. Motion, 5. Rhythm, Emission-refusal layer (tighter than diagnosis refusal), Emitting a portable system from `study`, If the user says "build it" (+14 more)

### Community 234 - "Skills to Evaluate (2026-07-26)"
Cohesion: 0.12
Nodes (13): DesignSystemGenerator, _filter_anti_patterns_for_mode(), Drop "avoid dark mode" advice once dark mode is the resolved answer., Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., Execute searches across multiple domains., Find matching reasoning rule for a category., Apply reasoning rules to search results. (+5 more)

### Community 235 - "Skills to Evaluate (2026-07-27)"
Cohesion: 0.19
Nodes (15): build_identity_text(), build_index(), discover_projects(), load_calibrated_thresholds(), load_index(), main(), Path, query() (+7 more)

### Community 236 - "Japanese Learning Patterns — Vit"
Cohesion: 0.29
Nodes (6): Active Error Patterns, Grammar Patterns, Japanese Learning Patterns — Vit, Kanji Progress, Notes, Vocab List

### Community 237 - "Workflow Orchestration Patterns"
Cohesion: 0.29
Nodes (6): Adaptive fan-out sizing (heuristic, not yet measured), Batch size vs. collision rate (measured, not theoretical), Fixed-dimension pipeline vs. self-selecting flock, Hypothesis panel (judge-panel diversity) — tested against debug-mantra, rejected, Reference, Workflow Orchestration Patterns

### Community 238 - "Plan: AIDLC Configurable Artifact Path"
Cohesion: 0.29
Nodes (6): Artifact Mapping, Config (`~/.claude/.claude/aidlc.json`), Decision, Files Changed, Plan: AIDLC Configurable Artifact Path, Problem

### Community 239 - "Known issue"
Cohesion: 0.29
Nodes (6): Context, Install steps (when needed), Known issue, Not yet decided, Plan: Install mobilewright (deferred — not currently installed), Uninstall

### Community 240 - "CHANGELOG.md Module"
Cohesion: 0.29
Nodes (6): Added, Changed, Changelog, Documentation, Fixed, [Unreleased]

### Community 241 - "/skill-review — Skill Evolution Engine"
Cohesion: 0.29
Nodes (6): Output Format, Phase 1 — Read Usage Log, Phase 2 — Diff Against skill-log.md, Phase 3 — Generate Proposals, Phase 4 — Auto-Draft (Crystallized Only), /skill-review — Skill Evolution Engine

### Community 242 - "Session Search Index Script"
Cohesion: 0.48
Nodes (6): Connection, _ensure_schema(), _extract_text(), _index_file(), main(), Path

### Community 243 - "FigJam to Markdown Converter"
Cohesion: 0.29
Nodes (6): FigJam to Markdown Converter, Input, Notes, Output, Process, Required: Source Note

### Community 244 - "Sync All Script"
Cohesion: 0.48
Nodes (5): generate_instruction_file(), merge_skills_dir(), mirror_dir(), sync-all.sh script, should_run()

### Community 245 - "Session Flow & Save/Discard Gate"
Cohesion: 0.29
Nodes (6): Evidence Gate, Hooks Summary, Meaningful Changes (triggers Session Save), Save/Discard Gate, Session Flow & Save/Discard Gate, Session Lifecycle

### Community 246 - "Agy Companion"
Cohesion: 0.29
Nodes (6): Agy Companion, Delegation scope, Result handling, Routing controls, Two invocation modes, Usage patterns observed in this workspace

### Community 247 - "Authentication & Authorization"
Cohesion: 0.29
Nodes (6): Authentication & Authorization, Authentication Methods, Authorization Patterns, Security Checklist, Tips, Token Refresh Flow

### Community 248 - "Dockerfile Best Practices"
Cohesion: 0.29
Nodes (6): Docker, Docker Compose, Dockerfile Best Practices, Environment Variables, Rules, Tips

### Community 249 - "Modern Python Backend Reference"
Cohesion: 0.29
Nodes (6): Async Rules, Modern Python Backend Reference, Official Documentation Anchors, Review Checklist, Runtime Rules, Testing

### Community 250 - "CLI Companions — agy vs codex-rescue"
Cohesion: 0.29
Nodes (6): CLI Companions — agy vs codex-rescue, Not a fit for either, Note, Pick agy when, Pick codex-rescue when, Shared routing controls (both)

### Community 251 - "Five Principles of Code Simplification"
Cohesion: 0.29
Nodes (6): 1. Preserve Behavior Exactly, 2. Chesterton's Fence, 3. Prefer Clarity Over Cleverness, 4. Follow Project Conventions, 5. Scope to What Changed, Five Principles of Code Simplification

### Community 252 - "Code Simplification"
Cohesion: 0.29
Nodes (6): Anti-Rationalization, Code Simplification, Load Right Reference, Red Flags, When NOT to Use, When to Use

### Community 253 - "Debug Mantra — Workspace Workflow"
Cohesion: 0.29
Nodes (6): Debug Mantra — Workspace Workflow, Step 1 — Load the method first, Step 2 — Gates (interleave with the mantra's own steps, don't wait until the end), Step 3 — After fix lands, Step 4 — Hand off, Verification

### Community 254 - "Architecture Patterns"
Cohesion: 0.29
Nodes (6): Architecture Patterns, Context Selection (Microservices), Decision Guide, Microservices, Monolith, When to use

### Community 255 - "Earnings Preview Workflow"
Cohesion: 0.29
Nodes (6): Earnings Preview Workflow, Step 1 — Gather Context (Web Search), Step 2 — Key Metrics Framework (Sector-Specific), Step 3 — Scenario Analysis, Step 4 — Catalyst Checklist, Step 5 — Trading Setup

### Community 256 - "Kiro Hook Schema"
Cohesion: 0.29
Nodes (6): Action Types, Event Types, Example, Gotchas, Kiro Hook Schema, Schema

### Community 257 - "Swift Observation Reference"
Cohesion: 0.29
Nodes (6): Default Rule, Main Actor, Migration Rules, Property Wrapper Rules, Review Checks, Swift Observation Reference

### Community 258 - "iOS Testing and Accessibility Reference"
Cohesion: 0.29
Nodes (6): Accessibility Contract, Accessibility Review, iOS Testing and Accessibility Reference, Review Checks, UI Test Identifiers, XCTest and XCUITest

### Community 259 - "Japanese Practice — Progress Tracking &"
Cohesion: 0.29
Nodes (6): Assessment Rubric, Common Mistake Patterns, Difficulty Levels, Japanese Practice — Progress Tracking & Levels, Kanji Tracker, Weekly Check-In

### Community 261 - "AI Instruction"
Cohesion: 0.29
Nodes (6): AI Instruction, Antipattern, Context, LESSON-AUTH-001: 401 Unauthorized — Token Expired or Incorrect, Problem, Solution

### Community 262 - "Swift Language Essentials"
Cohesion: 0.29
Nodes (6): Actors, Async/Await, Optionals, Sendable, Swift Language Essentials, Types

### Community 263 - "SwiftUI macOS UI Components"
Cohesion: 0.29
Nodes (6): Context Menu, Keyboard Shortcuts, List — Hierarchical (File Tree), NavigationSplitView (macOS 13+), SwiftUI macOS UI Components, Toolbar

### Community 264 - "data-testid Naming Convention"
Cohesion: 0.29
Nodes (6): data-testid Naming Convention, Naming Rules, Pattern, Shared Components, Type Abbreviation Table, Usage

### Community 265 - "Locator Strategy"
Cohesion: 0.29
Nodes (7): 🛑 Anti-Patterns (Zero Tolerance), 🔀 Hybrid Locator Pattern (Recommended), ⚠️ i18n / Bi-language Consideration, 🌐 Labels File Pattern (Bi-language TH/EN), PART 5: Locator Strategy, Priority Order (Stability First), WebSocket Testing Pattern

### Community 266 - "Playwright TypeScript Reference"
Cohesion: 0.29
Nodes (6): Assertion Strategy, Debugging and CI, Fixtures and POM, Locator Strategy, Playwright TypeScript Reference, TypeScript Rules

### Community 267 - "Persona 4: Bug Hunter"
Cohesion: 0.29
Nodes (6): Bug Life Cycle (per finding), Output Template, Persona 4: Bug Hunter, Rules, Seven-Category Scan, Severity

### Community 268 - "Persona 1: Code Reviewer"
Cohesion: 0.29
Nodes (6): Five-Axis Review, Output Template, Persona 1: Code Reviewer, Rules, Severity Labels, Spec Fidelity (report separately from the five axes below)

### Community 269 - "Skill Framework"
Cohesion: 0.29
Nodes (6): Frontmatter + Trigger Phrases, Human-in-the-Loop (HitL) Taxonomy, Line Budget, Skill Framework, The 5-Part Checklist, Validation Checklist

### Community 270 - "Data Gathering"
Cohesion: 0.29
Nodes (6): 2a) Qualitative (News, MD&A, Guidance), 2b) Revenue and Net Income (Last 5 Quarters), 2c) EPS (Last 5 Quarters), 2d) Valuation, 2e) Dividend, Data Gathering

### Community 271 - "Scenario Reader"
Cohesion: 0.29
Nodes (6): Derive Mode, How it works, Output per test case, Scenario Reader, Tips, When to use

### Community 272 - "Test Cases Reader"
Cohesion: 0.29
Nodes (6): Derive Mode, Output per test case, Process, Rules, Test Cases Reader, When to use

### Community 273 - "Craft Flow"
Cohesion: 0.29
Nodes (6): Craft Flow, Step 1: Shape the Design, Step 2: Load References, Step 3: Build, Step 4: Visual Iteration, Step 5: Present

### Community 274 - "Modern React Reference"
Cohesion: 0.29
Nodes (6): Component Rules, Hook Rules, Modern React Reference, Performance, React 19 Form and Optimistic Patterns, Server State

### Community 275 - "Skills to Evaluate (2026-07-29)"
Cohesion: 0.11
Nodes (17): Accountant-Learning, agent-memory-private, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d: (+9 more)

### Community 276 - "Decision Tree"
Cohesion: 0.33
Nodes (5): Decision Tree, Done When, Instructions, Prerequisites, /resume — Pick up where you left off

### Community 277 - "/review — Pre-merge quality gate"
Cohesion: 0.33
Nodes (5): Done When, Fan-Out (all 4 personas), Instructions, Prerequisites, /review — Pre-merge quality gate

### Community 278 - "~/.claude — AI Agent Workspace"
Cohesion: 0.33
Nodes (5): ~/.claude — AI Agent Workspace, Feature Planning Artifacts, Memory Lifecycle, Setup on a New Machine, Structure

### Community 279 - "Requirements Gathering"
Cohesion: 0.33
Nodes (5): How it works, Output per story, Requirements Gathering, Tips, When to use

### Community 280 - "Reverse Engineering"
Cohesion: 0.33
Nodes (5): How it works, Output, Reverse Engineering, Tips, When to use

### Community 281 - "Jetpack Compose Reference"
Cohesion: 0.33
Nodes (5): Composition Rules, Jetpack Compose Reference, Navigation, Preview Rules, State Hoisting

### Community 282 - "Kotlin Coroutines and Flow Reference"
Cohesion: 0.33
Nodes (5): Compose Collection, Dispatcher Rules, Error Handling, Kotlin Coroutines and Flow Reference, ViewModel State

### Community 283 - "Android Kotlin and Jetpack Compose"
Cohesion: 0.33
Nodes (5): Android Kotlin and Jetpack Compose, Default Stack, Load Order, Official Documentation Anchors, Review Checklist

### Community 284 - "Android Testing and Accessibility Reference"
Cohesion: 0.33
Nodes (5): Android Testing and Accessibility Reference, Compose UI Tests, Review Checks, Semantics Contract, Test Tags

### Community 285 - "Appium Inspector / Session Capabilities"
Cohesion: 0.33
Nodes (5): Android — install-if-missing, launch-if-present, Appium Inspector / Session Capabilities, Before opening Inspector, iOS, `noReset` vs `fullReset` — don't confuse these

### Community 286 - "npm Install Troubleshooting for ~/.appium"
Cohesion: 0.33
Nodes (5): Failure mode 1 — `ENOTEMPTY` on rename, Failure mode 2 — silently missing nested dependency, Failure mode 3 — fix applied but Inspector/client still shows the old error, General rule, npm Install Troubleshooting for ~/.appium

### Community 287 - "Version Compatibility (Appium v2 vs v3)"
Cohesion: 0.33
Nodes (5): Check before installing, Known-good pairings (confirmed on this machine, 2026-07), Switching core major, Version Compatibility (Appium v2 vs v3), Which one does the user actually need?

### Community 288 - "Appium Ops"
Cohesion: 0.33
Nodes (5): Appium Ops, Load Right Reference, Objective, Process, Rules

### Community 289 - "Simplification Process"
Cohesion: 0.33
Nodes (5): Simplification Process, Step 1: Understand (Chesterton's Fence), Step 2: Identify Opportunities, Step 3: Apply Incrementally, Step 4: Verify

### Community 290 - "Earnings Preview — Pre-Earnings Setup"
Cohesion: 0.33
Nodes (5): Critical Rules, Earnings Preview — Pre-Earnings Setup, Load Right Reference, Output Format, Persona and Safety

### Community 291 - "English Practice — Progress Tracking &"
Cohesion: 0.33
Nodes (5): Assessment Rubric, Common Mistake Patterns (Tracked Over Time), English Practice — Progress Tracking & Levels, Milestones, Weekly Check-In

### Community 292 - "Route Naming Convention"
Cohesion: 0.33
Nodes (5): Deep Link Scheme, Navigation & Deep Link Standards — All Platforms, Route Naming Convention, Rules, Rules

### Community 293 - "UI States Standards — All Platforms"
Cohesion: 0.33
Nodes (5): Rules, State Model Pattern (All Platforms), Test Identifier Requirements, The 4 Mandatory States, UI States Standards — All Platforms

### Community 294 - "Web UI Automation Templates Index"
Cohesion: 0.33
Nodes (5): Lessons, Page Objects, Shared Resources, Templates, Web UI Automation Templates Index

### Community 295 - "AI Instruction"
Cohesion: 0.33
Nodes (5): AI Instruction, Context, LESSON-FILE-001: Multipart Upload Error — Wrong MIME Type or File Path, Problem, Solution

### Community 296 - "AI Instruction"
Cohesion: 0.33
Nodes (5): AI Instruction, Context, LESSON-SETUP-001: Playwright request Fixture from beforeAll Cannot Be Reused, Problem, Solution

### Community 297 - "AI Instruction"
Cohesion: 0.33
Nodes (5): AI Instruction, Context, LESSON-FILE-001: File Upload Failed — Incorrect File Path, Problem, Solution

### Community 298 - "AI Instruction"
Cohesion: 0.33
Nodes (5): AI Instruction, Context, LESSON-LOC-001: Multiple Elements Match — Locator Not Specific Enough, Problem, Solution

### Community 299 - "SwiftUI State Management"
Cohesion: 0.33
Nodes (5): @Observable (macOS 14+ / Swift 5.9) — prefer this, @Observable vs ObservableObject, ObservableObject (macOS 11–13 compat), SwiftUI State Management, Wrapper Quick-Pick

### Community 300 - "macOS SwiftUI Skill"
Cohesion: 0.33
Nodes (5): Anti-Patterns, Load Right Reference, macOS SwiftUI Skill, Trigger, When to Fall Back to AppKit

### Community 301 - "Coding Standards"
Cohesion: 0.33
Nodes (6): 1. ⏰ Async/Await Usage, 2. 🏷️ Naming Conventions, 3. 📁 File and Folder Naming Standards, 4. 🏗️ Test Structure (AAA Pattern), 5. 📦 Import Organization, PART 2: Coding Standards

### Community 302 - "Project Structure: API Testing"
Cohesion: 0.33
Nodes (6): 🔗 API Setup Pattern (Seed via API before UI test), 🔗 Cross-Layer Shared Fixtures (API + Web UI), PART 1: Overview, 📁 Project Structure: API Testing, 🔑 Standard Environment Variables, 🔍 Terminology: Service vs Helper

### Community 303 - "Coding Standards"
Cohesion: 0.33
Nodes (6): 1. ⏰ Async/Await Usage, 2. 🏷️ Naming Conventions, 3. 📁 File and Folder Naming Standards, 4. 🏗️ Test Structure (AAA Pattern), 5. 📦 Import Organization, PART 2: Coding Standards

### Community 304 - "Project Structure: Web UI Testing"
Cohesion: 0.33
Nodes (6): 🔗 API Setup Pattern (Seed via API before UI test), 🔗 Cross-Layer Shared Fixtures (API + Web UI), PART 1: Overview, 📁 Project Structure: Web UI Testing, 🔑 Standard Environment Variables, 🔍 Terminology: Service vs Helper

### Community 305 - "Post-Mortem — Workspace Workflow"
Cohesion: 0.33
Nodes (5): Post-Mortem — Workspace Workflow, Step 1 — Load the method first, Step 2 — After the post-mortem is approved, Step 3 — Hand off, Verification

### Community 306 - "Persona 3: Security Auditor"
Cohesion: 0.33
Nodes (5): Output Template, Persona 3: Security Auditor, Review Scope, Rules, Severity Classification

### Community 307 - "Persona 2: Test Engineer"
Cohesion: 0.33
Nodes (5): Approach, Coverage Scenarios, Output Template, Persona 2: Test Engineer, Rules

### Community 308 - "Python Database Writer"
Cohesion: 0.33
Nodes (5): Forbidden Patterns, Python Database Writer, Rules, Steps, When to use

### Community 309 - "Pre-Launch Checklist"
Cohesion: 0.33
Nodes (5): Documentation, Infrastructure, Performance, Pre-Launch Checklist, Security

### Community 310 - "Stock Peer Comparison Report — HTML"
Cohesion: 0.33
Nodes (5): Critical Rules (MANDATORY), Load Right Reference, Persona and Safety, Stock Peer Comparison Report — HTML Artifact, Workflow Overview

### Community 311 - "Quick Review Summary Format"
Cohesion: 0.33
Nodes (5): Column Timeline, Divider (MANDATORY between Quick Review and Full Detail), Format Rules, Quick Review Summary Format, Required Format

### Community 312 - "Quick Scenario"
Cohesion: 0.33
Nodes (5): Mode Detection (Step 0), Process, Quick Scenario, Rules, When to use

### Community 313 - "Output Format Template"
Cohesion: 0.33
Nodes (5): Appendices (use when applicable), Appendix A — Deep-Dive Data Table (Batch only), Appendix B — Portfolio Fit and ETF Lens, Appendix C — Peer Comparison, Output Format Template

### Community 314 - "TradingAgents Orchestrator — Multi-Role Investment Workflow"
Cohesion: 0.33
Nodes (5): Critical Rules (MANDATORY), Load Right Reference, Persona and Safety, Red Flags, TradingAgents Orchestrator — Multi-Role Investment Workflow

### Community 315 - "Tailwind CSS v4 Standards"
Cohesion: 0.33
Nodes (5): Best Practices, Design System, Integration, Responsiveness, Tailwind CSS v4 Standards

### Community 316 - "Claude Code Plugin — Manual Install"
Cohesion: 0.40
Nodes (4): Claude Code Plugin — Manual Install Guide, Common mistakes, Verify, When to use

### Community 317 - "English Grammar Patterns — Vit"
Cohesion: 0.11
Nodes (17): Accountant-Learning, agent-memory-private, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d: (+9 more)

### Community 318 - "Statusline Setup & Troubleshooting"
Cohesion: 0.40
Nodes (4): Config location, If statusline shows nothing, Statusline Setup & Troubleshooting, Testing the script

### Community 319 - "Design — Scheduled agent-memory Maintenance Rollout"
Cohesion: 0.40
Nodes (4): Design — Scheduled agent-memory Maintenance Rollout, Known limitations (real, not hypothetical — found during rollout), Rollout order, What exists (built once, reused by every project)

### Community 320 - "Task Progress — Scheduled agent-memory Maintenance"
Cohesion: 0.40
Nodes (4): Done, Next (waiting on real Sunday data, not blocked on anything technical), Pending — remaining projects (not scheduled yet), Task Progress — Scheduled agent-memory Maintenance Rollout

### Community 321 - "Five-Axis Review"
Cohesion: 0.40
Nodes (4): Five-Axis Review, Output Format, Rules, Severity Labels

### Community 322 - "Review Scope"
Cohesion: 0.40
Nodes (4): Output Format, Review Scope, Rules, Severity Classification

### Community 323 - "Coverage Scenarios"
Cohesion: 0.40
Nodes (4): Approach, Coverage Scenarios, Output Format, Rules

### Community 324 - "/build — Implement incrementally"
Cohesion: 0.40
Nodes (4): /build — Implement incrementally, Done When, Instructions, Prerequisites

### Community 325 - "/plan — Design + break into"
Cohesion: 0.40
Nodes (4): Done When, Instructions, /plan — Design + break into tasks, Prerequisites

### Community 326 - "/ship — Deploy with confidence"
Cohesion: 0.40
Nodes (4): Done When, Instructions, Prerequisites, /ship — Deploy with confidence

### Community 327 - "/simplify — Reduce complexity"
Cohesion: 0.40
Nodes (4): Done When, Instructions, Prerequisites, /simplify — Reduce complexity

### Community 328 - "/spec — Define what to build"
Cohesion: 0.40
Nodes (4): Done When, Instructions, Prerequisites, /spec — Define what to build

### Community 329 - "/test — Prove it works"
Cohesion: 0.40
Nodes (4): Done When, Instructions, Prerequisites, /test — Prove it works

### Community 330 - "Install Hooks Script"
Cohesion: 0.70
Nodes (4): load_template(), main(), merge(), normalize()

### Community 331 - "Skill Candidates (shadow-capture, staging only)"
Cohesion: 0.40
Nodes (4): Format, Promoting a candidate, Skill Candidates (shadow-capture, staging only), When to write one

### Community 332 - "Deep Modules"
Cohesion: 0.40
Nodes (4): Deep Modules, Scanning a Codebase for Opportunities, The Principle (Ousterhout), When to Skip

### Community 333 - "Error Handling Standards — All Platforms"
Cohesion: 0.40
Nodes (4): Error Categories, Error Handling Standards — All Platforms, Response Convention, Rules

### Community 334 - "Logging Standards — All Platforms"
Cohesion: 0.40
Nodes (4): Log Levels, Logging Standards — All Platforms, Rules, Security Rules

### Community 335 - "Handoff Skill Architecture"
Cohesion: 0.40
Nodes (4): Handoff, Instructions, Output, When to Use

### Community 336 - "Hook Creator (Kiro)"
Cohesion: 0.40
Nodes (4): Agent Memory Hook Set, Hook Creator (Kiro), Process, Rules

### Community 337 - "Source-Driven Development"
Cohesion: 0.40
Nodes (4): Process, Rules, Source-Driven Development, Unverified Flag

### Community 338 - "API Templates & Lessons Index"
Cohesion: 0.40
Nodes (4): API Templates & Lessons Index, Lessons, Shared Resources, Templates

### Community 339 - "Automation Templates & Lessons — Master"
Cohesion: 0.40
Nodes (4): Automation Templates & Lessons — Master Index, Categories, Reading Protocol, Summary

### Community 340 - "Mobile Automation Templates Index"
Cohesion: 0.40
Nodes (4): Lessons, Mobile Automation Templates Index, Shared Resources, Templates

### Community 341 - "Business Domain: Authentication"
Cohesion: 0.40
Nodes (4): Business Domain: Authentication, Files, Keywords, Triggers

### Community 342 - "Business Domain: Common (Shared UI Logic)"
Cohesion: 0.40
Nodes (4): Business Domain: Common (Shared UI Logic), Files, Keywords, Triggers

### Community 343 - "Business Domain: Document Management"
Cohesion: 0.40
Nodes (4): Business Domain: Document Management, Files, Keywords, Triggers

### Community 344 - "Business Domain: Finance"
Cohesion: 0.40
Nodes (4): Business Domain: Finance, Files, Keywords, Triggers

### Community 345 - "AI-DLC Knowledge Base — Master Index"
Cohesion: 0.40
Nodes (4): AI-DLC Knowledge Base — Master Index, Domains, Resolution Order, Score Thresholds

### Community 346 - "API Lessons Index"
Cohesion: 0.40
Nodes (4): API Lessons Index, Edges (Related Lessons), Lessons, Popular Patterns

### Community 347 - "Mobile Lessons Index"
Cohesion: 0.40
Nodes (4): Edges, Lessons, Mobile Lessons Index, Popular Patterns

### Community 348 - "Web UI Lessons Index"
Cohesion: 0.40
Nodes (4): Edges, Lessons, Popular Patterns, Web UI Lessons Index

### Community 349 - "Embedding: AppKit ↔ SwiftUI"
Cohesion: 0.40
Nodes (4): Bridging Actions: SwiftUI → AppKit Host, Embedding: AppKit ↔ SwiftUI, NSHostingView — SwiftUI inside AppKit, NSViewRepresentable — AppKit inside SwiftUI

### Community 350 - "Drag and Drop"
Cohesion: 0.40
Nodes (4): Drag and Drop, Generation 1: NSItemProvider (macOS 11+), Generation 2: Transferable (macOS 13+) — prefer for in-app, UTType Reference

### Community 351 - "API Schema Definition"
Cohesion: 0.40
Nodes (5): 1️⃣ Basic Schema Structure, 2️⃣ Optional: Advanced Validation, 3️⃣ Common Patterns, PART 8: API Schema Definition, 🎯 Purpose

### Community 352 - "Advanced UI (Expert Tier)"
Cohesion: 0.40
Nodes (5): 1. Bot Detection Bypass (Security Evasion), 2. Time Manipulation (UI Time Travel), 3. Atomic Web UI+API Integration (Seed Data Gem), 4. Network Fuzzing & Mutation (Chaos Gem), PART 10: Advanced UI (Expert Tier)

### Community 353 - "Rollback Strategy"
Cohesion: 0.40
Nodes (4): Post-Deploy Verification, Roll Back Immediately If, Rollback Plan Template, Rollback Strategy

### Community 354 - "Feature Flags and Staged Rollout"
Cohesion: 0.40
Nodes (4): Feature Flag Lifecycle, Feature Flags and Staged Rollout, Rollout Decision Thresholds, Staged Rollout

### Community 355 - "Shipping and Launch"
Cohesion: 0.40
Nodes (4): Anti-Rationalization, Load Right Reference, Red Flags, Shipping and Launch

### Community 356 - "Thai Accountant & Finance — Senior/Manager"
Cohesion: 0.40
Nodes (4): Persona & Principles, Quick Decision Framework, Reference Loading Guide, Thai Accountant & Finance — Senior/Manager Level

### Community 357 - "Ubiquitous Language"
Cohesion: 0.40
Nodes (4): Process, Re-running, Rules, Ubiquitous Language

### Community 358 - "Memory Write Scan Hook"
Cohesion: 0.23
Nodes (12): is_memory_path(), main(), scan(), content_scan_verdict(), find_project_root(), is_trusted(), _load_content_scanner(), main() (+4 more)

### Community 359 - "User Prompt Submit Hook"
Cohesion: 0.07
Nodes (36): BaseHTTPRequestHandler, datetime, check_memory_passive_review(), check_project_memory_nudge(), check_skill_trigger(), count_uncaptured_work(), is_memory_path(), main() (+28 more)

### Community 360 - "Memory Decay Scheduler Script"
Cohesion: 0.60
Nodes (3): scan_project(), scan_skill_dormancy(), memory-decay-scheduler.sh script

### Community 361 - "Session Start Script"
Cohesion: 1.00
Nodes (3): auto_act_check(), sep(), session-start.sh script

### Community 362 - "Setup/Setuptests Script"
Cohesion: 0.50
Nodes (3): PATH, setupTests.sh script, VOLTA_HOME

### Community 363 - "Agent Memory Index"
Cohesion: 0.50
Nodes (3): Agent Memory Index, Knowledge, Plans

### Community 364 - "awk multiline-record anchor gotcha + grep-substring"
Cohesion: 0.50
Nodes (3): awk multiline-record anchor gotcha + grep-substring false-positive, Context & Problem, Learned Solution

### Community 365 - "Doubt-Driven Review"
Cohesion: 0.50
Nodes (3): Doubt-Driven Review, Process, When (any one is true)

### Community 366 - "Interview Me"
Cohesion: 0.50
Nodes (3): Interview Me, Process, Question Order

### Community 367 - "Interview — Router"
Cohesion: 0.50
Nodes (3): Interview — Router, Mode Detection (auto — do NOT ask), Step 0 — Scope Check (always runs first, silent)

### Community 368 - "iOS Swift and SwiftUI"
Cohesion: 0.50
Nodes (3): iOS Swift and SwiftUI, Load Order, Testability

### Community 369 - "Common Automation Templates Index"
Cohesion: 0.50
Nodes (3): Common Automation Templates Index, Lessons, Templates

### Community 370 - "Business Domains Index"
Cohesion: 0.50
Nodes (3): Business Domains Index, Domains, Reading Protocol

### Community 371 - "Common Business Rules"
Cohesion: 0.50
Nodes (3): Business Logic Rules, Common Business Rules, Web UI Actions

### Community 372 - "Document Business Rules"
Cohesion: 0.50
Nodes (3): Business Logic Rules, Document Business Rules, Web UI Actions

### Community 373 - "Finance Business Rules"
Cohesion: 0.50
Nodes (3): Business Logic Rules, Finance Business Rules, Web UI Actions

### Community 374 - "Management Talk — Workspace Workflow"
Cohesion: 0.50
Nodes (3): Management Talk — Workspace Workflow, Step 1 — Load the method first, Step 2 — After the draft is approved and used

### Community 375 - "Playwright Standards"
Cohesion: 0.50
Nodes (3): ⚠️ Gotchas, Key Mandates, Playwright Standards

### Community 376 - "When to Load This Skill"
Cohesion: 0.50
Nodes (3): Load, Security, When to Load This Skill

### Community 377 - "Skill Creator"
Cohesion: 0.50
Nodes (3): Load Right Reference, Red Flags, Skill Creator

### Community 378 - "React and Web Frontend"
Cohesion: 0.50
Nodes (3): Load Order, Official Documentation Anchors, React and Web Frontend

### Community 382 - "Candidate Snapshot (2026-07-25)"
Cohesion: 0.11
Nodes (17): Accountant-Learning, agent-memory-private, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d: (+9 more)

### Community 383 - "Candidate Snapshot (2026-07-26)"
Cohesion: 0.11
Nodes (17): Accountant-Learning, agent-memory-private, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d: (+9 more)

### Community 384 - "Candidate Snapshot (2026-07-27)"
Cohesion: 0.11
Nodes (17): Accountant-Learning, agent-memory-private, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d: (+9 more)

### Community 385 - "Candidate Snapshot (2026-07-29)"
Cohesion: 0.12
Nodes (16): Accountant-Learning, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d:, Global skills — zero recorded uses since usage-log start: (+8 more)

### Community 398 - "Skill Usage Log Hook"
Cohesion: 0.12
Nodes (16): Accountant-Learning, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d:, Global skills — zero recorded uses since usage-log start: (+8 more)

### Community 416 - "Setup/Setupmemory Script"
Cohesion: 0.12
Nodes (16): Accountant-Learning, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d:, Global skills — zero recorded uses since usage-log start: (+8 more)

### Community 431 - "Agent Memory Eval State Reference"
Cohesion: 0.12
Nodes (16): Accountant-Learning, agy-plugin-cc, agy-plugin-codex, Auto-memory name collisions (active vs archive, or duplicate active):, Fitness-Tracker, Global (~/.claude), Global skill-candidates untouched >90d:, Global skills — zero recorded uses since usage-log start: (+8 more)

### Community 433 - "Fitness Personal Context"
Cohesion: 0.19
Nodes (16): detect_domain(), _domain_keywords(), _get_bm25(), _load_csv(), _load_product_keywords(), Load CSV and return list of dicts, with mtime-based caching., Fitted BM25 index for this file+columns, with mtime-based caching., Core search function using BM25. Returns (results, bm25_or_none). (+8 more)

### Community 434 - "Memory Index — My Investment Port"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 435 - "The Pattern: Timer State = Ownership"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 436 - "Critical: Variable Scoping in Templates"
Cohesion: 0.18
Nodes (8): BM25, _normalize(), Apply synonym substitution before tokenizing., BM25 ranking algorithm for text search, Lowercase, normalize synonyms, split, remove punctuation, filter stopwords, Build BM25 index from documents, Score all documents against query, All indexed terms, for suggestion/typo-recovery purposes.

### Community 437 - "Memory Palace: Home Assistant Project"
Cohesion: 0.22
Nodes (8): Append to project memory, Diversification Memory, Schema, Scope, Stamp the output, State file location, The diversification rule (mandatory), Why this exists

### Community 440 - "Session State"
Cohesion: 0.25
Nodes (7): `design-system/<project>/MASTER.md` / `DESIGN.md` audit, Output shape, Stamp-vs-page check, Structural fingerprint check, The `audit` Trigger — Read-Only Quality Check, What `audit` does, When to hand off

### Community 441 - "Memory Index"
Cohesion: 0.16
Nodes (10): Architecture (confirmed 2026-08-13, from source + a live DB query — not guessed), docs/wiremock-playbook.html — added 2026-08-13, Full `/confirm` saga scope — investigated 2026-08-13, NOT attempted (correctly, not a gap), Full pass over dev-sales-return's external integrations — 2026-08-13, Local end-to-end verification — CONFIRMED WORKING, 2026-08-13, Next concrete step, Real SAP response capture — resolved 2026-08-13, no live call needed, sap-mock/ — SAP-facing endpoints (RMA + CN/DN), port 8093 (+2 more)

### Community 442 - "MEMORY.md Module"
Cohesion: 0.18
Nodes (10): Context, Critical files, Critical findings baked into the design (verified this session, not guesses), Directory — `~/Git/Personal/stock-report-bot/` (new, standalone, sibling to `line-claude-bot`), `.env` (independent copy of the LINE secrets already sitting in `line-claude-bot/.env` — no shared runtime between the two standalone processes), Flow (`main.py`, called by `scripts/run.sh` only after the throttle gate passes), Recommended Approach, Scheduling — `scripts/run.sh` (throttle pattern copied from `~/.claude/scripts/candidate-scheduler.sh`, `CHECK_INTERVAL_DAYS=14`) (+2 more)

### Community 443 - "MEMORY.md Module"
Cohesion: 0.20
Nodes (9): Context, Critical files, Directory layout — `~/Git/Personal/line-claude-bot/`, `.env` (gitignored — copy of the two secrets already known from this session, kept independent of `~/.claude/settings.json`'s `mcpServers.line-bot` block since this is a standalone always-on process, not a Claude Code MCP client), launchd (plists live in `~/Library/LaunchAgents/`, NOT checked into the repo — matches this workspace's existing convention that plists are loaded manually via `launchctl load`, not installed by any script), LINE → Claude chatbot (personal, single-user), Recommended Approach, Request flow (`server.py` + `claude_worker.py` + `line_client.py`) (+1 more)

### Community 444 - "Memory Index"
Cohesion: 0.24
Nodes (6): Corrections to prior scope findings, How to apply going forward, Progress log (2026-08-16 gap-fill run, user instruction "เอาหมดเลยอ่ะ" = fill everything), Tier 1 — entire standards with ZERO lessons currently (highest priority, no overlap to reconcile), Tier 2 — existing lesson is shallow vs a much deeper/broader source (depth extensions, highest exam-value first), Memory Index

### Community 449 - "project_mode.md Module"
Cohesion: 0.22
Nodes (8): `~/.claude/rules/routing.md` diff (Kouen Task Sync section — 3 line edits only), `~/.claude/scripts/project_router.py` (new), Content-based project router for Kouen Task Sync — Design, Context, Logical Design, Strategic Design, Tactical Design, Verification

### Community 451 - "2026-07-29.md"
Cohesion: 0.50
Nodes (3): Graphify Semantic-Label Snapshot (2026-07-29), Projects with unlabeled communities (>10% placeholder):, Result

### Community 452 - "2026-07-30.md"
Cohesion: 0.25
Nodes (7): Artifacts, Context, Dev Task Progress — line-claude-bot, Infrastructure, Integration — launchd + tunnel auto-registration, Server Logic — Webhook receipt + dispatch, Summary

### Community 453 - "2026-07-29.md"
Cohesion: 0.25
Nodes (7): Artifacts, Context, Dev Task Progress — stock-report-bot, Infrastructure, Integration — launchd throttle + scheduling, Server Logic — data + claude + delivery, Summary

### Community 454 - "2026-07-30.md"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-14), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 455 - "workflow-usage-log.py"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-15), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 464 - "Skills to Evaluate (2026-08-07)"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-16), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 465 - "The `redesign` Trigger — Same Content, Different Structural Fingerprint"
Cohesion: 0.33
Nodes (5): Multi-page flow — lock a system first, then redesign each page, Non-destructive implementation rule, Single-page flow, Step 0 — Detect scope first, The `redesign` Trigger — Same Content, Different Structural Fingerprint

### Community 466 - "_palette_is_dark"
Cohesion: 0.33
Nodes (6): _palette_is_dark(), WCAG relative luminance of a #RRGGBB string, or None if unparseable., True when a colors.csv row's Background is a dark surface., Pick the highest-ranked palette matching the resolved mode.      Only the dark c, _relative_luminance(), _select_palette_for_mode()

### Community 467 - "_resolve_color_mode"
Cohesion: 0.33
Nodes (6): _query_wants_dark(), True when a styles.csv row describes itself as dark-first., True when the query explicitly asks for a dark theme., Resolve the mode the rest of the output has to agree with., _resolve_color_mode(), _style_is_dark_primary()

### Community 468 - "validate_data.py"
Cohesion: 0.83
Nodes (3): _check_file(), main(), _read_rows()

### Community 470 - "2026-08-01.md"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-17), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 471 - "2026-08-02.md"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-18), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 472 - "2026-08-03.md"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-19), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 473 - "2026-08-05.md"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-20), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 474 - "2026-08-06.md"
Cohesion: 0.33
Nodes (5): Daily Digest (2026-08-21), Decay flags, In-progress plans (first unchecked task), Paused gates, Pending auto-act reports

### Community 475 - "2026-08-07.md"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-14)

### Community 476 - "2026-08-01.md"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-15)

### Community 477 - "2026-08-02.md"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-16)

### Community 482 - "Skills to Evaluate (2026-08-17)"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-17)

### Community 483 - "Skills to Evaluate (2026-08-18)"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-18)

### Community 484 - "Skills to Evaluate (2026-08-19)"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-19)

### Community 485 - "Skills to Evaluate (2026-08-20)"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-20)

### Community 486 - "Skills to Evaluate (2026-08-21)"
Cohesion: 0.33
Nodes (5): Pending improvements:, Report result here (append below this line, before the next scheduled run overwrites nothing -- this file is dated, not appended-over), Result, Run: pass@3 eval on each skill above, Skills to Evaluate (2026-08-21)

### Community 489 - "2026-08-19.md"
Cohesion: 0.50
Nodes (3): Graphify Semantic-Label Snapshot (2026-08-19), Projects with unlabeled communities (>10% placeholder):, Result

### Community 490 - "Task Progress — Content-based Project Router"
Cohesion: 0.50
Nodes (3): Done, Next (deferred, out of this feature's scope), Task Progress — Content-based Project Router

### Community 491 - "cloudflared quick tunnel unreachable — QUIC blocked by local network"
Cohesion: 0.50
Nodes (3): cloudflared quick tunnel unreachable — QUIC blocked by local network, Context & Problem, Learned Solution

### Community 492 - "Script works when run manually, hangs/fails silently under launchd"
Cohesion: 0.50
Nodes (3): Context & Problem, Learned Solution, Script works when run manually, hangs/fails silently under launchd

### Community 493 - "An empty launchd log file can mean "succeeded silently," not "broken""
Cohesion: 0.50
Nodes (3): An empty launchd log file can mean "succeeded silently," not "broken", Context & Problem, Learned Solution

### Community 494 - "Generating a launchd plist via bash heredoc — the `2>&1` XML trap"
Cohesion: 0.50
Nodes (3): Context & Problem, Generating a launchd plist via bash heredoc — the `2>&1` XML trap, Learned Solution

## Knowledge Gaps
- **3152 isolated node(s):** `changelog`, `git`, `bootstrap-new-machine.sh script`, `build-cache-scheduler.sh script`, `candidate-scheduler.sh script` (+3147 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **86 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **2 possibly unreachable function(s):** `_resolveTarget.sh script`, `resolve_and_validate()`
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Playwright UI Testing - Rules & Templates` connect `Playwright UI Testing - Rules &` to `Advanced UI (Expert Tier)`, `Test Naming Conventions`, `Structure & Design`, `Locator Strategy`, `Coding Standards`, `Project Structure: Web UI Testing`, `Infrastructure & Scripts Standard (package.json)`, `Performance & Reliability`, `Interactions & Assertions`?**
  _High betweenness centrality (0.000) - this node is a cross-community bridge._
- **What connects `changelog`, `git`, `Shared helpers for PreToolUse gate hooks. Fail-open: callers catch all errors.` to the rest of the system?**
  _3211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Date & Utility Helpers` be split into smaller, more focused modules?**
  _Cohesion score 0.06901960784313725 - nodes in this community are weakly interconnected._
- **Should `Fix Generated Playwright Files (Postman Migration)` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `Postman Collection Parser & Converter` be split into smaller, more focused modules?**
  _Cohesion score 0.06448202959830866 - nodes in this community are weakly interconnected._
- **Should `Appium Testing (Android) - Rules &` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Appium Testing (iOS) - Rules &` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._