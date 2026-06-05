---
name: jira-bridge
description: >
  Bridge between Jira/Confluence and AIDLC workflow via Atlassian MCP Server (official).
  Triggers: "ticket #xxx", "Jira #xxx", "create ticket", "sprint report",
  "close ticket", "sync Jira", "link PR", "update status"
  Uses official atlassian/atlassian-mcp-server (OAuth 2.1 / API token).
version: 1.0.0
last_improved: 2026-06-05
improvement_count: 0
---

# Jira Bridge (Atlassian MCP Server)

> Connects Jira/Confluence ↔ AIDLC workflow via official Atlassian MCP Server.
> Endpoint: `https://mcp.atlassian.com/v1/mcp`
> Auth: OAuth 2.1 (browser flow) or API token (headless)

---

## Setup

### MCP Configuration

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.atlassian.com/v1/mcp"]
    }
  }
}
```

### Prerequisites

- Atlassian Cloud site with Jira (and/or Confluence)
- Node.js v18+
- First-time: browser-based OAuth 2.1 consent flow
- Headless: API token (admin must enable, scoped token required)

### Recommended AGENTS.md tip (reduces token cost)

```markdown
## Atlassian Rovo MCP

When connected to atlassian-rovo-mcp:
- **MUST** use Jira project key = YOURPROJ
- **MUST** use cloudId = "https://yoursite.atlassian.net"
- **MUST** use `maxResults: 10` for ALL JQL search operations
```

---

## Trigger Detection

| Pattern | Action |
|---------|--------|
| `ticket #xxx`, `Jira #xxx`, `PROJ-xxx` | → fetch-ticket → AIDLC |
| `create ticket`, `create bug`, `create task` | → create-ticket |
| `sprint report`, `sprint summary` | → sprint-report |
| `close ticket`, `done ticket` | → close-ticket |
| `link PR` | → link-pr |
| `update status` | → transition-ticket |

---

## Workflows

### 1. Fetch Ticket → AIDLC (fetch-ticket)

**Steps:**
1. Search/get issue: "Find issue PROJ-123"
2. Extract: Summary, Description, Acceptance Criteria (from description or custom field), Status, Linked issues
3. Format as AIDLC input (same as azure-devops-bridge)
4. Route to AIDLC phase

### 2. Create Ticket (create-ticket)

**Steps:**
1. Determine issue type: Bug, Task, Story, Sub-task
2. Create issue with: summary, description, priority, assignee, sprint, labels
3. Link to parent (Epic or Story) if specified
4. Return ticket key (e.g., PROJ-456)

### 3. Transition Ticket (transition-ticket)

**Steps:**
1. Get current status
2. Find available transitions
3. Confirm with user before transitioning
4. Add comment on transition (English)

### 4. Close Ticket (close-ticket)

**Steps:**
1. Check all sub-tasks/children are Done
2. If incomplete → notify user, do not close
3. Transition to Done/Closed
4. Add completion comment

### 5. Link PR (link-pr)

**Steps:**
1. Use Jira's development panel integration (via Git provider)
2. Or add PR URL as comment/remote link
3. Transition status to "In Review" or equivalent

### 6. Sprint Report (sprint-report)

**Steps:**
1. Get current sprint for board
2. Get sprint issues with statuses
3. Format as MD report:
   - Total tickets / Done / In Progress / To Do
   - Velocity (if available)

---

## Tool Mapping (Atlassian MCP ↔ AIDLC Operations)

| AIDLC Operation | Atlassian MCP Action | Notes |
|----------------|---------------------|-------|
| Fetch ticket details | "Get issue PROJ-123" | Natural language via MCP |
| Create ticket | "Create [type] in [project]" | Story, Bug, Task, Sub-task |
| Update status | "Transition PROJ-123 to [status]" | Respects workflow transitions |
| Add comment | "Add comment to PROJ-123" | English for traceability |
| Link issues | "Link PROJ-123 blocks PROJ-456" | blocks, is blocked by, relates to |
| Sprint info | "Get current sprint for board [name]" | Board-based, not project-based |
| Search | "Find issues where [JQL]" | Full JQL support |
| Bulk operations | "Update issues [JQL filter]" | Via consecutive commands |

---

## Comparison with Azure DevOps Bridge

| Feature | Azure DevOps (MCP) | Jira (Atlassian MCP) |
|---------|-------------------|---------------------|
| Auth | PAT token | OAuth 2.1 / API token |
| Ticket types | PBI, Bug, Task, Test Case | Story, Bug, Task, Epic, Sub-task |
| Hierarchy | Epic → PBI → Task | Epic → Story → Sub-task |
| Sprint | Iteration Path | Board → Sprint |
| Test management | Built-in (Test Plans) | Via Zephyr/Xray plugin (separate) |
| PR linking | Native (`wit_link_work_item_to_pull_request`) | Via Git integration or remote link |
| Custom fields | System.* fields | Custom field IDs |
| MCP tools | Dedicated typed tools (wit_*, repo_*) | Natural language via Rovo |

---

## Rules

1. **Always fetch fresh data** — Do not cache ticket state
2. **Confirm before state change** — Ask user before transitioning
3. **Comment on every state change** — English, include context
4. **Don't close incomplete** — If any child is still open → do not close parent
5. **Respect workflow** — Jira enforces transition rules; check available transitions first
6. **JQL for search** — Use JQL syntax for complex queries

---

## Integration with AIDLC

Same integration points as `azure-devops-bridge/SKILL.md`:

| AIDLC Phase | Integration |
|-------------|-------------|
| Lite Inception | Fetch ticket → extract AC → build mini-spec |
| Phase 2.2 | Upload test scenarios (as sub-tasks or linked Test issues) |
| Phase 2.4 | Upload test results (as comment or attachment) |
| Phase 3.3 | Link PR + transition to "In Review" |
| Close | Verify children done → transition to "Done" + comment |

---

## Verification

- [ ] MCP connection verified (OAuth flow or API token)
- [ ] Fresh data fetched for all reads
- [ ] State changes confirmed with user before execution
- [ ] Comment added on every transition
- [ ] No incomplete children when closing parent ticket
- [ ] JQL queries return expected results

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Atlassian MCP Server (`mcp-remote`) | Integration | OAuth-based access to Jira + Confluence |
| Jira project key + board name | Configuration | Route to correct project |
| `.aidlc/` folder | Artifact store | Store ticket source, decisions |
| Jira workflow transitions | Platform config | Know valid status transitions |

---

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| Before status transitions | Single select (confirm new status) | Before transitioning ticket |
| Before creating tickets | Checkbox (confirm type + details) | Before writing to Jira |
| Before closing ticket | Checkbox (all children verified) | Before marking as Done |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.
