# Resources Discovery

Find what already exists before building anything new.

## When to use
- Starting work on a new feature in an existing codebase
- About to create a new utility, component, or helper
- Want to avoid duplicating work that's already been done
- Working on a new PBI for an existing system (Incremental Discovery)

## How it works

### Step 0: Load Implementation Context
- Read `implementation[SYSTEM_FEATURE_CAMEL].md` if it exists
- Extract: "Existing Assets", "Architecture Design", "Templates Found"
- If file doesn't exist → new system/feature → continue with empty context

### Step 1: Read Index Files
- Determine category from workflow_type:
  - `api_automation` | `postman_migration` → api
  - `webui_automation` → webUi
  - `android_automation` | `ios_automation` → mobile
- Load category index directly (no master index needed):
  - API: `ai-agent/knowledge/automation/api/apiIndex.json`
  - UI: `ai-agent/knowledge/automation/webUi/webUiIndex.json`
  - Mobile: `ai-agent/knowledge/automation/mobile/mobileIndex.json`
- Nano scan `ai-agent/knowledge/automation/common/commonIndex.json` → extract subCategories only
- Nano scan lessons index based on workflow_type:
  - api: `ai-agent/knowledge/lessons/api/apiLessonsIndex.json`
  - webUi: `ai-agent/knowledge/lessons/webUi/webUiLessonsIndex.json`
  - mobile: `ai-agent/knowledge/lessons/mobile/mobileLessonsIndex.json`
- Deep Abstraction Match for lessons:
  1. Identify abstract technical concern of each sub-feature
  2. Analogical Reasoning: "What category handles the same abstract concern?"
     - "login flow" / "token" / "session" → auth
     - "file upload" / "attachment" → file
     - "element not found" / "overlay" → visibility/locator
     - "wait for response" / "async" → timing
  3. Match against ALL category keys + popular_patterns
  4. Never conclude "no match" based on category name alone

### Step 2: Full Feature Asset Scan
- Read the ENTIRE feature directory to understand the full picture
- Check all directories for `[SYSTEM_FEATURE_KEBAB]`:
  - api: `tests/api-testing/helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/api-testing/fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`
  - webUi: `tests/web-testing/pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/web-testing/helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`
  - android: `tests/mobile-testing/pages/android/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/mobile-testing/helpers/shared-services/`
  - ios: `tests/mobile-testing/pages/ios/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` and `tests/mobile-testing/helpers/shared-services/`
  - ALL: Check `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`
- If path not found → listDirectory on `tests/` root to discover actual structure → update paths and retry
- Deep read: extract class names, method signatures, existing locators, internal logic
- Classify (Anti-Redundancy Rule):
  - `reuse` — already does what you need, use as-is
  - `extend` — close enough, add a method or parameter
  - `create` — ONLY if NO existing asset or template can be repurposed

### Step 2.1: Similar Features (In-Context Learning)
- Search for tests with similar keywords (translate Thai → English abstract terms first)
- Read top 2-3 most relevant similar test files
- Extract: test structure, class/method design, patterns

### Step 2.2: Test Data Library
- Search `testScenarioIndex.json` for matching system/feature
- Match by data structure similarity, field name patterns
- Extract: field structure, validation rules, relationships, boundary values

### Step 3: Dynamic Matching with Templates
- Analyze existing assets (Step 2) + architecture pattern + requirements
- Match templates ONLY for parts classified as "create"
- Filter: keep only matching items

### Step 4: Gap Analysis
- Compare required vs available assets
- Identify missing assets with estimated effort
- Prioritize: Critical > High > Medium > Low

### Step 5: Business Logic
- Nano scan `ai-agent/knowledge/business/businessIndex.json`
- Deep Abstraction Match:
  1. Look at flow only: Input → Process → Output
  2. Analogical Reasoning across ALL domains
  3. Never conclude "no match" based on domain name alone
- Load `ai-agent/knowledge/business/{domain}/business{Domain}Rules.json` for matched domains only
- Extract: validation rules, business constraints, workflow logic

### Step 6: Knowledge Buffer Capture
- Identify new patterns NOT in templates and NOT in codebase
- "Reusable 2+ features" = abstract concern appears in ≥2 distinct sub-features or is cross-cutting (auth, error handling, file ops)
- Calculate Reusability Score: (reuse + extend) / total required × 100
- Determine strategy: Reuse / Adapt / Create

## Classification decision tree
```
Does existing code do exactly what I need?
  → Yes: reuse
  → Partially: extend
  → No match at all: create
```

## Tips
- Always search before creating — the #1 source of tech debt is duplicate code nobody knew existed
- Search by abstract concept, not exact name — "auth flow" might be called `loginService`, `authHelper`, or `tokenManager`
- If >60% can be reused, the feature is cheaper than it looks
- If <30% can be reused, consider whether the existing architecture fits at all
- If PBI keywords are Thai → translate to English abstract terms first before searching

## Smart-Copy Rule
When using templates or existing code:
1. Read source template file
2. Select only the needed function/class
3. Trace its dependencies
4. Copy function + dependencies only
- ❌ Forbidden: bulk copy entire file
- ✅ Allowed: copy only function + dependencies

## Output Format
```
### 🔍 Resources Discovery
- Existing Assets: [N] (reuse/extend/create classification)
- Templates Found: [N] matched
- Lessons Learned: [N] applicable
- Similar Features: [N] found
- Test Data Library: Found/Not found
- Business Logic: [N] rules matched
- Gap Analysis: [N] items to create
- Knowledge Buffer: [N] new patterns captured
- Reusability Score: XX%
- Strategy: [Reuse / Adapt / Create]
```
