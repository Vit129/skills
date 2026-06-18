---
name: claude-plugin-manual-install
description: How to manually install a Claude Code plugin from GitHub without using /plugin install slash command
metadata:
  type: reference
---

# Claude Code Plugin — Manual Install Guide

## When to use
When `/plugin install` slash command is not available (background session, bash-only context).

## Step-by-step

### 1. Find the marketplace name
```bash
gh api repos/<owner>/<repo>/contents/.claude-plugin/marketplace.json --jq '.content' | base64 -d | python3 -c "import json,sys; print(json.load(sys.stdin)['name'])"
```
The `name` field is the **marketplace name** — NOT the repo name.
Example: repo `freema/cursor-plugin-cc` → marketplace name `tomas-cursor`

### 2. Clone repo to marketplaces dir (dir name MUST match marketplace name)
```bash
gh repo clone <owner>/<repo> ~/.claude/plugins/marketplaces/<marketplace-name>
```

### 3. Get version + commit SHA
```bash
VERSION=$(cat ~/.claude/plugins/marketplaces/<marketplace-name>/plugins/<plugin-name>/plugin.json | python3 -c "import json,sys; print(json.load(sys.stdin)['version'])")
COMMIT=$(git -C ~/.claude/plugins/marketplaces/<marketplace-name> rev-parse HEAD)
```

### 4. Copy plugin to cache (dir name MUST match marketplace name)
```bash
mkdir -p ~/.claude/plugins/cache/<marketplace-name>/<plugin-name>/<version>
cp -r ~/.claude/plugins/marketplaces/<marketplace-name>/plugins/<plugin-name>/. \
       ~/.claude/plugins/cache/<marketplace-name>/<plugin-name>/<version>/
```

### 5. Create .claude-plugin/plugin.json in BOTH locations
Simplified format only — remove extra fields like `url`, `homepage`, `repository`, `license`:
```json
{
  "name": "<plugin-name>",
  "version": "<version>",
  "description": "...",
  "author": { "name": "..." }
}
```

Files to create:
- `~/.claude/plugins/marketplaces/<marketplace-name>/.claude-plugin/plugin.json`
- `~/.claude/plugins/cache/<marketplace-name>/<plugin-name>/<version>/.claude-plugin/plugin.json`

### 6. Register in known_marketplaces.json
```json
"<marketplace-name>": {
  "source": { "source": "github", "repo": "<owner>/<repo>" },
  "installLocation": "/Users/supavit.cho/.claude/plugins/marketplaces/<marketplace-name>",
  "lastUpdated": "<ISO timestamp>"
}
```

### 7. Register in installed_plugins.json
Key format: `<plugin-name>@<marketplace-name>`
```json
"<plugin-name>@<marketplace-name>": [{
  "scope": "user",
  "installPath": "/Users/supavit.cho/.claude/plugins/cache/<marketplace-name>/<plugin-name>/<version>",
  "version": "<version>",
  "installedAt": "<ISO timestamp>",
  "lastUpdated": "<ISO timestamp>",
  "gitCommitSha": "<commit-sha>"
}]
```

### 8. Enable the plugin (CRITICAL — all plugins start disabled)
```bash
claude plugin enable <plugin-name>@<marketplace-name>
```

### 9. Reload in Claude Code session
```
/reload-plugins
```

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| marketplace dir name ≠ marketplace.json `name` | Use `name` from `marketplace.json`, not repo name |
| Missing `.claude-plugin/plugin.json` in marketplaces dir | Must exist in BOTH marketplaces and cache |
| Extra fields in plugin.json (url, homepage, license) | Strip to: name, version, description, author only |
| Forgot `claude plugin enable` | New plugins are disabled by default |
| Wrong key in installed_plugins.json | Must be `plugin@marketplace`, not `plugin@repo-name` |

## Verify
```bash
claude plugin list  # check Status: ✔ enabled
# then in Claude Code session:
/reload-plugins     # should show N+1 plugins
/cursor:setup       # or equivalent health-check command
```
