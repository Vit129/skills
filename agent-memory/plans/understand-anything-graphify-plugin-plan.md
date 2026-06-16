# Plan: Understand-Anything + Graphify Plugin Integration

Date: 2026-06-13
Status: draft
Owner: agent-memory/plans

## Decision

Keep Graphify as the primary navigation and routing layer. Add Understand-Anything as an optional learning/dashboard layer that can consume or cross-link Graphify outputs instead of replacing them.

Short version:

- Graphify = agent-first map, routing, query/path/explain, persistent workspace graph.
- Understand-Anything = human-first dashboard, guided onboarding, chat/explain/diff experience.
- Integration goal = one mental model, two surfaces.

## Why This Direction

Graphify is already wired into this workspace through `GRAPHIFY_USAGE.md`, Claude/Codex/Gemini routing, and shared skills. Replacing it would break existing habits and documentation. Understand-Anything is valuable when the output needs to teach or onboard a human, especially through an interactive dashboard.

The integration should preserve the Graphify-first rule:

1. Use Graphify before broad file reading.
2. Use Graphify outputs as the stable map.
3. Use Understand-Anything when the user asks for dashboard, guided tour, onboarding, or interactive exploration.

## Current Local State

- Codex-side Understand-Anything install was completed with the documented installer.
- Installed symlinks under `~/.agents/skills/`:
  - `understand`
  - `understand-chat`
  - `understand-dashboard`
  - `understand-diff`
  - `understand-domain`
  - `understand-explain`
  - `understand-knowledge`
  - `understand-onboard`
- Repo checkout:
  - `~/.understand-anything/repo`
- Universal plugin root:
  - `~/.understand-anything-plugin`
- Claude native plugin marketplace install was started but interrupted before completion.

## Target Architecture

### Layer 1: Graphify Core

Graphify remains responsible for:

- Repo structure navigation.
- `query`, `path`, and `explain` workflows.
- `graphify-out/graph.json`, `GRAPH_REPORT.md`, and HTML graph outputs.
- Agent routing policy in `GRAPHIFY_USAGE.md`.
- Stable cross-agent source of truth.

### Layer 2: Understand-Anything Experience

Understand-Anything is responsible for:

- Interactive dashboard when the user wants to visually explore the repo.
- Guided tours and onboarding.
- Human-friendly explain/chat flows.
- Diff impact UI when useful.
- Knowledge-base exploration if it adds value beyond Graphify reports.

### Layer 3: Bridge Contract

Create a thin bridge policy rather than a heavy converter at first:

- If `graphify-out/graph.json` exists, run Graphify first and record the relevant query/path/explain result before invoking Understand-Anything.
- If `.understand-anything/knowledge-graph.json` exists, treat it as a dashboard artifact, not the routing source of truth.
- Do not commit both graph systems' generated outputs blindly. Decide per repo whether generated graph artifacts are tracked.
- When results disagree, Graphify wins for routing/navigation; Understand-Anything wins only for UI/dashboard interpretation.

## Proposed Commands

Graphify-first investigation:

```bash
graphify query "<question>"
graphify explain "<node-or-topic>"
graphify path "<source>" "<target>"
```

Understand-Anything exploration:

```text
/understand
/understand-dashboard
/understand-chat <question>
/understand-explain <file-or-symbol>
/understand-diff
/understand-onboard
```

Codex skill invocation should map to the installed `understand*` skills after restarting the CLI.

## Implementation Phases

### Phase 1: Finish Install Verification

Acceptance:

- `~/.agents/skills/understand*/SKILL.md` resolves correctly.
- `~/.understand-anything-plugin` points to the plugin checkout.
- Claude native plugin is either installed or explicitly documented as not installed.
- No existing Graphify skill is overwritten.

Tasks:

1. Verify every `understand*` symlink target.
2. Inspect each installed `SKILL.md` frontmatter/name for collisions.
3. Run `claude plugin marketplace add Egonex-AI/Understand-Anything`.
4. Run `claude plugin install understand-anything`.
5. Re-run `claude plugin list`.

### Phase 2: Routing Documentation

Acceptance:

- `GRAPHIFY_USAGE.md` explains when to use Understand-Anything.
- `AGENTS.md`, Codex `AGENTS.md`, and Gemini `GEMINI.md` remain generated from the same source path if updated.
- The new rule does not weaken Graphify-first navigation.

Tasks:

1. Add a short "Understand-Anything companion" section to `GRAPHIFY_USAGE.md`.
2. Update `/Users/supavit.cho/.codex/rules/skill-map.md` only if skill routing needs explicit mention.
3. Regenerate agent entrypoints with `scripts/sync-agent-instructions.sh` if source instructions change.

### Phase 3: Bridge Experiment

Acceptance:

- On one repo, run Graphify query first, then Understand-Anything dashboard.
- Compare outputs without committing generated graph artifacts unless explicitly requested.
- Document where each tool is stronger.

Candidate repo:

- `/Users/supavit.cho/Git/Personal/My-Investment-Port`

Experiment flow:

```bash
graphify query "what are the main architecture communities?"
graphify explain "agent-memory"
```

Then run:

```text
/understand
/understand-dashboard
/understand-onboard
```

Record:

- Whether Understand-Anything can reuse enough existing structure to be useful.
- Runtime cost/time.
- Generated files.
- Whether generated files should be ignored or tracked.

### Phase 4: Optional Automation

Only automate after Phase 3 proves useful.

Possible helper:

```text
/graphify-understand <question-or-path>
```

Behavior:

1. Run Graphify query/path/explain first.
2. If the user asks for visual/onboarding/chat, invoke Understand-Anything next.
3. Summarize both outputs with clear labels.

Do not build this helper until the manual flow is proven.

## File Policy

Default generated-output policy:

- Keep Graphify outputs under the existing repo-specific policy.
- Treat `.understand-anything/` as generated output until reviewed.
- Never stage graph output churn automatically.
- If both systems generate large JSON/HTML files, stage only the files explicitly requested.

Suggested ignore review per project:

```gitignore
.understand-anything/intermediate/
.understand-anything/diff-overlay.json
```

Do not add `.understand-anything/knowledge-graph.json` to `.gitignore` globally until deciding whether the team wants to share the dashboard graph.

## Risks

- Duplicate graph outputs can create noisy diffs.
- Understand-Anything may encourage bypassing the existing Graphify-first routing.
- Claude native plugin install may add new marketplace state outside repo-local files.
- LLM-backed analysis can be slower or require credentials depending on command behavior.
- Skill-name collisions are possible if future Graphify or Understand-Anything skills use generic names.

## Rollback

Codex-side uninstall:

```bash
~/.understand-anything/repo/install.sh --uninstall codex
```

Claude-side rollback, if installed:

```bash
claude plugin uninstall understand-anything
claude plugin marketplace remove Understand-Anything
```

If generated project artifacts are created during experiments, remove only the explicit generated paths from that repo after checking `git status`.

## Open Questions

- Should Claude native plugin be installed globally, or should Codex-only skills be enough for now?
- Should `.understand-anything/knowledge-graph.json` be committed in selected repos?
- Should Graphify outputs be linked from the Understand-Anything dashboard docs, or should the bridge stay procedural?
- Does Understand-Anything add enough value for `kb/terry` compared with existing Graphify + NotebookLM workflow?

## Recommended Next Action

Finish Claude plugin install and then run a controlled experiment in one repo without committing generated artifacts. Keep Graphify as the first command in the workflow and use Understand-Anything only when the user wants a dashboard, guided tour, onboarding, or interactive explanation.
