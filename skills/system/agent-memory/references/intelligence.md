# Intelligence

How Agent Memory routes knowledge, scores usefulness, captures lessons, and evolves over time.

## Core Loop

```text
Read memory → Use knowledge → Observe outcome → Update Palace + Knowledge
```

Every durable learning signal must land in Markdown:

- `knowledge/index.md`
- `knowledge/evolution.md`
- `knowledge/lessons/{domain}/index.md`
- optional lesson detail file

## Outcome Signals

Use domain-native signals:

| Domain | Positive | Negative |
|--------|----------|----------|
| Code | PASS | FAIL |
| Design | APPROVE | REJECT |
| Writing | ACCEPT | REVISE |
| Decision | POSITIVE | NEGATIVE |
| Learning | MASTERED | GAP |
| Research | VALIDATED | DISPROVEN |

## Score Rules

Scores are lightweight routing hints, not truth.

| Event | Score Change | Other Updates |
|-------|--------------|---------------|
| Positive outcome | +0.5, max 10.0 | increment applied/usage |
| Negative outcome | -1.0, min 0.0 | mark review needed if repeated |
| Lesson prevents failure | +0.5 | increment prevented |
| Lesson becomes stale | no automatic score | status = stale |

Thresholds:

| Score | Status | Behavior |
|-------|--------|----------|
| 7.0-10.0 | proven | prefer first |
| 3.0-6.9 | active | normal use |
| 1.0-2.9 | stale | warn before use |
| 0.0 | deprecated | skip unless requested |

## Routing

1. Extract intent: input → process → output.
2. Scan `knowledge/index.md` for matching keywords and article titles.
3. Scan `knowledge/lessons/{domain}/index.md` for relevant lessons.
4. Prefer higher score and stronger evidence.
5. If nothing matches, record a gap in `knowledge/index.md`.

## Knowledge Routing at Session Start

At session load, after reading `knowledge/index.md` and `knowledge/evolution.md`, run score-based routing to surface relevant knowledge for the user's current prompt.

### Steps

1. Extract keywords from the user's current prompt.
2. Scan the Articles table in `knowledge/index.md`: match the Keywords column against prompt keywords.
3. Scan the Lessons table in `knowledge/index.md` and `knowledge/lessons/{domain}/index.md`: match the Summary column (or Keywords/Confidence) against prompt keywords.
4. Sort article matches by Score DESC. Sort lesson matches by Confidence DESC.
5. Apply routing tiers:

| Score / Confidence | Tier | Behavior |
|--------------------|------|----------|
| 7.0–10.0 | proven | Surface first — high-value knowledge |
| 3.0–6.9 | active | Include normally |
| < 3.0 | stale | Warn before relying on it |

6. Keep the top 3 relevant matches (articles and lessons combined).
7. Include matched items in the session brief under "Relevant knowledge".
8. If no matches are found, note the topic as a potential knowledge gap in the brief. Do NOT auto-add to the Gaps table — just mention it so the user is aware.

## Lesson Capture

Capture a lesson when at least one is true:

- A bug or mistake was diagnosed and fixed.
- A repeated pattern succeeded.
- The user corrected a preference or workflow.
- A tool/path/workspace rule prevented future confusion.
- A decision explains why one approach was chosen over another.

Do not capture:

- transient errors with no future relevance
- unverified guesses
- generic advice already covered by an existing lesson

## Lesson Format

Add one row to `knowledge/lessons/{domain}/index.md`:

```markdown
| LESSON-DOMAIN-001 | bug | active | 1 | 1 | 0.90 | Absolute paths fixed hook routing | LESSON-DOMAIN-001.md |
```

Create detail file when needed:

```markdown
---
id: LESSON-DOMAIN-001
domain: domain
type: bug
status: active
confidence: 0.90
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Short Lesson Title

## Summary
{what to remember}

## Detail
{specific context}

## Apply Next Time
- {actionable rule}

## Evidence
- {session/path/test}
```

Then update `knowledge/index.md` Lessons and append to `knowledge/evolution.md`.

## Gap Tracking

When a task needs knowledge that does not exist, add a row:

```markdown
| {domain} | {missing template/lesson/rule} | YYYY-MM-DD | open | {why it matters} |
```

Close the gap when an article or lesson is created.

## Evolution Log

Append one row per meaningful change:

```markdown
| YYYY-MM-DD | {id} | status active→proven | PASS | 6.5 | 7.0 | tests passed in {path} |
```

Keep entries compact. Move old detail into article evidence sections if the file grows too large.

## Auto-Crystallization

When a pattern appears at least twice with positive outcomes in `knowledge/evolution.md`, it is a candidate for crystallization.

### Detection

Scan the Change Log in `knowledge/evolution.md` for entries that share the same domain or topic AND both have POSITIVE or VALIDATED signal. Two or more such entries indicate a recurring pattern worth capturing.

Safeguard: verify both source entries have the same domain/topic before crystallizing. Do not merge unrelated patterns from different domains.

### Draft Creation

1. Ask the user: "Pattern detected: {description}. Crystallize as draft article? [y/n]"
2. If confirmed, create `knowledge/{pattern-id}.md` with YAML frontmatter:

```yaml
---
id: {pattern-id}
type: pattern
scope: global
status: draft
score: 5.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
keywords: [from source entries]
---
```

3. Add a row to `knowledge/index.md` Articles table with Status = `draft`.
4. Append a POSITIVE row to `knowledge/evolution.md` noting the crystallization.

### Lifecycle: draft → active → proven → stale

| Transition | Condition | Score Change |
|------------|-----------|--------------|
| draft → active | One more positive use of the pattern after creation | +0.5 |
| active → proven | Score reaches ≥7.0 with multiple positive uses | — |
| active/proven → stale | Article unused for 60+ days | — |
| stale → active | Article used again with a positive outcome | +0.5 |

Promotion is checked during session-save when a lesson or outcome references an existing draft or active article. Update the Status column in `knowledge/index.md` and append a row to `knowledge/evolution.md` when a promotion occurs.

Staleness is checked during consolidation or session-save: if an article's `updated` date is more than 60 days old and it has not been referenced in any session, demote its status to `stale`.

## Nudge Rules

At session start, show at most three useful nudges:

- stale knowledge relevant to today's task
- open gaps relevant to today's task
- repeated lesson that may prevent failure
- old open thread likely to block the task

Suppress nudges the user ignored recently.
