# Statusline Setup & Troubleshooting

## Config location
`~/.claude/settings.json` → `statusLine.command`

```json
"statusLine": {
  "type": "command",
  "command": "bash /Users/supavit.cho/.claude/statusline-command.sh"
}
```

Script: `~/.claude/statusline-command.sh`
Shows: `user@host | cwd | git branch | model | ctx% | 5h usage | 7d usage`

## If statusline shows nothing

**Root cause:** `hasTrustDialogAccepted: false` in `~/.claude.json` for the current working directory blocks the statusline command from executing.

**Fix (bulk):**
```python
python3 -c "
import json
with open('/Users/supavit.cho/.claude.json', 'r') as f:
    d = json.load(f)
for v in d.get('projects', {}).values():
    if v.get('hasTrustDialogAccepted') == False:
        v['hasTrustDialogAccepted'] = True
with open('/Users/supavit.cho/.claude.json', 'w') as f:
    json.dump(d, f, indent=2)
"
```
Then restart Claude Code.

**For new directories:** trust dialog appears on first open — accept it once.

## Testing the script
```bash
echo '{"model":{"display_name":"Claude Sonnet 4.6"},"workspace":{"current_dir":"/Users/supavit.cho/.claude"},"context_window":{"used_percentage":12},"rate_limits":{"five_hour":{"used_percentage":30,"resets_at":1751000000},"seven_day":{"used_percentage":15,"resets_at":1751200000}}}' \
  | bash ~/.claude/statusline-command.sh
```
