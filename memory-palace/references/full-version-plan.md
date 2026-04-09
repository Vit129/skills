# Memory Palace — Full Version Plan

## Overview

Full version upgrades the Light markdown-based palace to a semantic search system
using ChromaDB + MCP server, inspired by [MemPalace](https://github.com/milla-jovovich/mempalace).

## Architecture

```
┌─────────────────────────────────────────┐
│           MCP Server (Python)           │
│  ┌───────────┐  ┌────────────────────┐  │
│  │  ChromaDB  │  │  SQLite (metadata) │  │
│  │ (vectors)  │  │  (palace structure)│  │
│  └───────────┘  └────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │         MCP Tools                  │  │
│  │  - store_conversation              │  │
│  │  - search_memory (semantic)        │  │
│  │  - list_wings / rooms              │  │
│  │  - get_room_context                │  │
│  │  - create_tunnel (cross-ref)       │  │
│  │  - compress_to_closet              │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Key Differences from Light Version

| Feature | Light | Full |
|---------|-------|------|
| Storage | Markdown files | ChromaDB + SQLite |
| Search | Manual file reading | Semantic vector search |
| Auto-capture | agentStop hook only | Every message auto-stored |
| Cross-session | Read state.md | Query by similarity |
| Compression | Manual closet files | AAAK dialect (experimental) |
| Setup | Zero dependencies | Python 3.9+ / ChromaDB |

## MCP Server Setup (Future)

```json
{
  "mcpServers": {
    "mempalace": {
      "command": "python",
      "args": ["-m", "mempalace.server"],
      "env": {
        "MEMPALACE_DB_PATH": ".claude/memory/palace.db",
        "MEMPALACE_CHROMA_PATH": ".claude/memory/chroma/"
      }
    }
  }
}
```

## Implementation Steps

1. Fork/adapt from https://github.com/milla-jovovich/mempalace
2. Create MCP server wrapper with tools above
3. Add auto-capture hook (promptSubmit event)
4. Add semantic search tool for cross-session recall
5. Implement AAAK compression for long-term storage
6. Migrate existing Light version rooms to ChromaDB

## References

- [MemPalace GitHub](https://github.com/milla-jovovich/mempalace)
- Uses ChromaDB for vector storage (local, no API needed)
- Uses SQLite for palace structure metadata
- 96.6% R@5 on LongMemEval benchmark (raw mode)
