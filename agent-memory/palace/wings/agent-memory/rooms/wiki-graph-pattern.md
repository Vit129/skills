# Wiki-Graph Pattern

## Current State
Wiki-Graph pattern ingested as alternative to RAG for knowledge management.

## Key Concepts
- Wiki-Graph: structured knowledge graph using markdown links (vs RAG vector search)
- Ingest flow: raw content → extract concepts → admission control → write to room
- Applied to agent-memory system: wings/rooms/tunnels = graph structure

## Decisions
- [2026-04-16] Chose Wiki-Graph over RAG for this system — zero dependencies, markdown-native
- [2026-04-16] Backlinks added to all lesson files for bidirectional navigation

## Source
Ingested from external research, applied to agent-memory architecture.
Merged from knowledge-ingest wing → agent-memory wing (2026-04-20)
