# Memory Protocol

At the start of every task, read `.ai/memory-protocol.md` in the project root and follow it exactly.

This file defines when and how to read/write `agent-memory/` files (CONTEXT.md, MEMORY.md, PLAYBOOK.md, knowledge/).

If `.ai/memory-protocol.md` does not exist, fall back to:
1. Read `agent-memory/CONTEXT.md` → current task
2. Read `agent-memory/MEMORY.md` → decisions + lessons
3. On task end → update both files
