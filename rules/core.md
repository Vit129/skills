# Core Rules

## Trust Priority (descending)

1. Latest explicit user instruction
2. Verified codebase state (grep/read before claiming)
3. `~/.claude/rules/` (this file)
4. Per-project CLAUDE.md / agent-memory/
5. General training knowledge

## Response Format

Every task response ends with:

```
✅ Done: <what was completed>
⏭️ Next: <suggested follow-up or "none">
💡 Why: <1-line rationale if non-obvious>
```

## Do

1. Run tests/build after every code change — deliver only green code
2. Read before write — understand existing code before modifying
3. Match project style, conventions, and libraries
4. State assumptions explicitly; ask when uncertain
5. Follow routing.md — `interview` is always the entry point (1-line scope check, full gather only when unclear), then call the skill that fits
6. Update the active feature's `dev-task-progress.md`/`qa-task-progress.md` checkboxes when task state changes
7. Cite evidence (file, line, command output) for claims
8. Use Thai for conversation, English for generated files

## Don't

1. Don't guess file contents — read first
2. Don't add features beyond what was asked
3. Don't retry same failing approach 3+ times — escalate or pivot
4. Don't modify unrelated code (no drive-by refactors)
5. Don't present assumptions as verified facts
6. Don't commit to main/master without explicit permission
7. Don't echo secrets — reference by key name only

## Memory Protocol

Canonical lifecycle (pattern promotion) lives in `~/.claude/CLAUDE.md` → **Memory Lifecycle**. This section only adds the Done-gate enforcement.

### Done-gate (MANDATORY — last action before Done)

Never mark ✅ Done before: checkboxes in the active `dev-task-progress.md`/`qa-task-progress.md` are updated, and reusable patterns are promoted to `PLAYBOOK.md`/`knowledge/`.

## Test-Before-Deliver

No task is complete until: build passes + relevant tests pass. If tests cannot run, state why.

## Git

- New branch before coding unless instructed otherwise
- Never push directly to `main`/`master` without permission

### VCS Remote by Path

- `~/.kiro/**`, `~/Git/Company/**` → Azure DevOps only. Never `gh`/GitHub CLI.
  Check `git remote -v` first (expect `ssh.dev.azure.com`).
  PR: `az repos pr create --repository <repo> --source-branch <branch> --target-branch main`
  az not authenticated → push branch, tell user to open PR manually.
- Everywhere else (personal projects) → GitHub as normal (`gh pr create` etc).

### Git Identity by Path

Enforced via `~/.gitconfig` (`[user]` = Vit129 default + `includeIf "gitdir:..."` for the two exceptions, `~/.gitconfig-work` holds the override) — not agent-enforced, git resolves it automatically per repo.

- `~/.kiro/**`, `~/Git/Company/**` → `Supavit Cho <supavit.cho@axonstech.com>` (work identity)
- Everywhere else (personal projects) → `Vit129 <vitosk129@gmail.com>`

### Skill/Workflow Precedence by Path

`~/.claude/skills/` and `~/.claude/rules/` (this file, `routing.md`, etc.) load globally regardless of cwd — but `~/.kiro/**` and `~/Git/Company/**` have their own local skill/steering set (`~/.kiro/skills/`, `~/.kiro/steering/`) built for a company team workflow: AIDLC governance gate, Azure DevOps tracker integration, TH/EN bilingual `Labels.ts`, stricter QA-only Mode Lock, hand-off-to-human heal policy. These two sets were deliberately diverged (see [[kiro-claude-skill-porting]] memory) — company process on one side, solo personal process on the other. Silently applying the wrong side's workflow inside the other's project is the failure mode this section exists to prevent.

- **Working inside `~/.kiro/**` or `~/Git/Company/**`:** that project's own `steering/`/`AGENTS.md`/local `SKILL.md` content is authoritative for QA/dev workflow. Route through its AIDLC gate, its Azure DevOps scripts, its heal policy — don't fall back to the personal `~/.claude` skill variant just because it's also loaded and sounds similar (e.g. don't apply personal's solo "1 attempt → debug-mantra-workflow" heal hand-off in a company repo that expects "hand off to the human QA/Dev").
- **Everywhere else (personal projects):** the global `~/.claude` skill set applies normally, per `routing.md`'s Skill Map.
- If a task's project path doesn't cleanly match either (e.g. a personal project nested inside a company workspace, or vice versa) — ask before assuming which workflow governs, rather than blending both.
