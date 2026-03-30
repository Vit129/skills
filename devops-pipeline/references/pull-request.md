# Pull Request Creation

Create PRs and link them to work items with test result summaries.

## When to use
- After automated testing passes
- Ready to submit code for review

## Prerequisites
- All tests must pass (tests_failed = 0)
- DevOps MCP tools available

## Steps
1. Create PR with title: `AB#{work_item_id}: {feature description}`
2. PR description: summary, work item reference, test results, TDD summary
3. Link PR to work items via MCP
4. Update work item status: "In Progress" → "Code Review"
5. Add comment with PR ID and test results

## Rules
- FORBIDDEN to create PR if any tests are still failing
- If MCP unavailable, provide manual instructions instead
