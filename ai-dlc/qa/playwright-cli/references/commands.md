# Playwright CLI Commands

Use `playwright-cli` for browser automation in coding agent context — token-efficient alternative to MCP.

## When to use CLI vs MCP

| Criteria | CLI | MCP |
|---|---|---|
| Coding agent + large codebase | ✅ recommended | ❌ token heavy |
| Exploratory / self-healing | ❌ | ✅ recommended |
| Quick screenshot / inspect | ✅ | ❌ overkill |
| Long-running autonomous flow | ❌ | ✅ persistent context |

## Core Commands

### Browser & Navigation
```bash
playwright-cli -s=pbi-12345 open https://sit.example.com
playwright-cli -s=pbi-12345 goto https://sit.example.com/login
```

### Snapshot (get element refs)
```bash
playwright-cli -s=pbi-12345 snapshot
# Output: YAML with element refs (e1, e2, e3...)
```

### Interact
```bash
playwright-cli -s=pbi-12345 fill e1 "testuser@example.com"
playwright-cli -s=pbi-12345 click e3
playwright-cli -s=pbi-12345 type "search query"
playwright-cli -s=pbi-12345 press Enter
```

### Screenshot
```bash
playwright-cli -s=pbi-12345 screenshot
playwright-cli -s=pbi-12345 screenshot e5
playwright-cli -s=pbi-12345 screenshot --filename=login-success.png
```

### Network Mocking
```bash
playwright-cli -s=pbi-12345 route "*/api/users" --body='{"users":[]}'
playwright-cli -s=pbi-12345 route-list
playwright-cli -s=pbi-12345 unroute "*/api/users"
```

### Debugging
```bash
playwright-cli -s=pbi-12345 console
playwright-cli -s=pbi-12345 network
playwright-cli -s=pbi-12345 eval "document.title"
playwright-cli -s=pbi-12345 tracing-start
playwright-cli -s=pbi-12345 tracing-stop
```

### Tab & Storage Management
```bash
playwright-cli -s=pbi-12345 tab-list / tab-new / tab-select / tab-close
playwright-cli -s=pbi-12345 cookie-list / cookie-set
playwright-cli -s=pbi-12345 localstorage-list / localstorage-set
playwright-cli -s=pbi-12345 state-save auth-state.json / state-load auth-state.json
```

### Cleanup
```bash
playwright-cli -s=pbi-12345 close
playwright-cli close-all
```

## Session Naming
Use `-s=<pbi-number>` or `-s=<system-feature>`:
```bash
playwright-cli -s=pbi-215314 open https://sit.example.com
playwright-cli -s=login-axons-one open https://sit.example.com/login
```

## Config
`.playwright/cli.config.json` (auto-loaded):
```json
{
  "browser": { "browserName": "chromium", "isolated": true, "launchOptions": { "headless": true } },
  "outputDir": ".playwright/output",
  "testIdAttribute": "data-testid"
}
```

## Integration
- **Code Writer:** use snapshot to find selectors before writing tests
- **Healer:** use snapshot to debug elements not found
- **Execution:** quick manual verification before/after test runs
- **Recorder:** use CLI instead of Playwright codegen for recording
