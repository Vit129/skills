# Skill & Hook Security Checklist

> Lightweight security scan for agent configuration files.
> Adapted from ECC's AgentShield concept — manual checklist version.
> Run before committing new/modified skills, hooks, or MCP configs.

---

## When to Apply

- Creating or modifying a skill in `ai-agent/skills/`
- Creating or modifying a Kiro hook in `.kiro/hooks/`
- Adding/changing MCP server configurations
- Reviewing PRs that touch agent config files

---

## Checklist

### 1. Prompt Injection Scan

| Check | Pass? |
|-------|-------|
| No instructions that override system prompt (e.g., "ignore previous instructions") | |
| No hidden Unicode characters (zero-width spaces, bidi overrides) | |
| No base64-encoded payloads in skill content | |
| No external URLs that could change without review | |
| No `eval()`, `exec()`, or dynamic code execution in hook commands | |

**Quick scan command:**
```bash
# Check for suspicious patterns in skills
rg -n 'ignore.*previous|ignore.*instructions|system.*prompt|base64|eval\(|exec\(' ai-agent/skills/
rg -nP '[\x{200B}\x{200C}\x{200D}\x{2060}\x{FEFF}]' ai-agent/skills/
```

### 2. Permission Scope

| Check | Pass? |
|-------|-------|
| Hook commands don't have unrestricted filesystem access | |
| No `rm -rf` or recursive deletes without safeguards | |
| No network calls to external services (curl, wget) without explicit purpose | |
| MCP servers use minimum required permissions | |
| No wildcard tool approvals in MCP autoApprove | |

### 3. Secret Exposure

| Check | Pass? |
|-------|-------|
| No API keys, tokens, or passwords in skill files | |
| No `.env` file paths hardcoded (use relative references) | |
| No credentials in hook command strings | |
| Git history doesn't contain accidentally committed secrets | |

**Quick scan command:**
```bash
# Check for potential secrets
rg -n 'sk-|ghp_|AKIA|password.*=|token.*=|secret.*=' ai-agent/skills/ .kiro/hooks/
```

### 4. Supply Chain

| Check | Pass? |
|-------|-------|
| External references (URLs, packages) are from trusted sources | |
| No typosquatting package names | |
| Pinned versions for any referenced tools | |
| Skills don't reference files outside the project without reason | |

### 5. Memory Safety

| Check | Pass? |
|-------|-------|
| Skills don't instruct agent to store secrets in memory files | |
| No instructions to persist raw user data in playbook | |
| Memory files have size limits enforced | |
| No instructions that bypass AIDLC phase gates | |

---

## Severity Levels

| Level | Action | Example |
|-------|--------|---------|
| 🔴 Critical | Block commit | Secret in file, eval() in hook |
| 🟡 Warning | Fix before merge | External URL without pinning |
| 🟢 Info | Note for review | Missing permission scope docs |

---

## Report Format

```markdown
## 🔒 Security Scan: [file/folder]

**Date:** YYYY-MM-DD
**Scanned:** [list of files]

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Prompt injection | ✅ Clean | No suspicious patterns |
| 2 | Permission scope | ⚠️ Warning | Hook uses broad glob |
| 3 | Secret exposure | ✅ Clean | No secrets found |
| 4 | Supply chain | ✅ Clean | All refs trusted |
| 5 | Memory safety | ✅ Clean | No unsafe storage |

**Verdict:** Safe to commit / Needs fixes
```

---

## Integration

- Run as part of `core/review-personas/` (security-auditor persona)
- Run before `/ship` command
- Run when `skill-sync-reminder` hook fires (new skill being synced)
