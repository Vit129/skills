# Bugfix Requirements Document

## Introduction

The agent-memory system currently implements ~40% of its original spec. There are three core systemic failures:

1. **JSON/Markdown format split** — JSON files (date-index.json, keyword-index.json, index.json, toolingLessonsIndex.json) are fragile, frequently stale, and create a mixed format that wastes tokens and adds parsing complexity. All stored content must be markdown.
2. **Knowledge never updates with Palace** — When sessions are saved and palace updates (rooms, state.md, search-index.md), the knowledge/ directory is never touched. Knowledge articles are stale, the index is hardcoded, and lessons are only captured manually. Knowledge must always update together with palace, or be merged into a unified structure.
3. **Spec'd features don't exist** — knowledge-evolution wing, skill crystallization, consolidation/auto-dream, nudge system, and score tracking are all specified but unimplemented.

The palace currently works "almost well but not great" — the wing/room/hall structure is sound, but indexes are dead and knowledge is disconnected.

This bugfix addresses the system in 3 phases (no features cut — all implemented incrementally):

- **Phase 1**: Palace + Knowledge + Lessons working 100% in all-markdown format
- **Phase 2**: Search indexes + user profile enhancements
- **Phase 3**: Skill crystallization + consolidation/auto-dream

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the system stores palace metadata (date index, keyword index) THEN the system uses JSON files (date-index.json, keyword-index.json) that are empty — zero entries despite 20+ sessions existing in rooms/

1.2 WHEN the system stores knowledge index data THEN the system uses a JSON file (knowledge/index.json) with hardcoded settings, a flat domain array with only 1 entry, and an evolution_log that doesn't reflect actual knowledge state

1.3 WHEN the system stores lesson data THEN the system uses a JSON file (lessons/tooling/toolingLessonsIndex.json) with nested objects, effectiveness scores, and timestamps that are difficult to maintain, read, and cost extra tokens to parse

1.4 WHEN a new session is saved via the session-save hook THEN the system does NOT update knowledge/ at all — no new knowledge articles are extracted, no lessons are captured, and the knowledge index remains stale

1.5 WHEN a new session is saved and palace state.md/search-index.md are updated THEN the knowledge index and lessons are NOT updated in sync — palace and knowledge drift apart over time

1.6 WHEN an agent reads the knowledge index THEN the system returns JSON that requires parsing logic, consuming extra tokens and adding complexity vs. a simple markdown table

1.7 WHEN an agent needs to find sessions by date or keyword THEN the system cannot use the JSON indexes because they contain zero entries (by_date: [], terms: {})

1.8 WHEN the system should maintain a knowledge-evolution wing (per spec) THEN the wing does not exist — there is no tracking of how knowledge evolves across sessions

1.9 WHEN the system should auto-crystallize lessons from session routing-log (per spec) THEN this feature is completely unimplemented — lessons are only created manually

1.10 WHEN the system should run consolidation/auto-dream to distill knowledge (per spec) THEN this feature is completely unimplemented — no rolling distillation occurs

1.11 WHEN the system stores wing metadata in hall.md THEN the rooms index table in hall.md is manually maintained and can drift from actual room files on disk

### Expected Behavior (Correct)

2.1 WHEN the system stores palace metadata (date index, keyword index) THEN the system SHALL use markdown files with tables that are human-readable and agent-parseable without JSON parsing

2.2 WHEN the system stores knowledge index data THEN the system SHALL use a markdown file (knowledge/index.md) with a table listing all knowledge articles, their type, scope, and keywords

2.3 WHEN the system stores lesson data THEN the system SHALL use a markdown file (e.g., lessons/tooling/index.md) with a table listing lesson ID, type, summary, date, and status — no JSON

2.4 WHEN a new session is saved via the session-save hook THEN the system SHALL update both palace (search-index.md, state.md) AND knowledge (index.md, relevant lesson files) in a single save operation — they must always update together

2.5 WHEN a new session contains learnable patterns, bugs, or architectural decisions THEN the system SHALL auto-extract these as lesson entries in the appropriate lessons/{domain}/index.md — not require manual creation

2.6 WHEN an agent reads the knowledge index THEN the system SHALL return a markdown table that can be scanned directly without parsing, reducing token overhead

2.7 WHEN an agent needs to find sessions by date or keyword THEN the system SHALL be able to scan the search-index.md table which contains all sessions (replacing the empty JSON indexes)

2.8 WHEN knowledge evolves across sessions (new lessons, updated patterns) THEN the system SHALL track this evolution in a knowledge-evolution section or dedicated file in markdown format

2.9 WHEN the system runs consolidation (Phase 3) THEN the system SHALL distill repeated patterns from lessons into knowledge articles using markdown format

2.10 WHEN the system stores ANY persistent data THEN the system SHALL use markdown files exclusively — zero JSON files for storage (JSON is only acceptable for tool configs like .config.kiro, not for memory content)

2.11 WHEN the system stores wing metadata in hall.md THEN the rooms index in hall.md SHALL accurately reflect the rooms that exist on disk

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the palace wing structure is used (wings/{name}/hall.md, rooms/, closets/, skills/) THEN the system SHALL CONTINUE TO use the same directory hierarchy and metaphor

3.2 WHEN knowledge articles are stored (e.g., design-craftsmanship-tokens.md, error-recovery-strategy.md) THEN the system SHALL CONTINUE TO use standalone markdown files with YAML frontmatter (name, description, type, scope, keywords)

3.3 WHEN session narrative is stored in room files THEN the system SHALL CONTINUE TO use markdown room files under wings/{name}/rooms/

3.4 WHEN cross-wing relationships are tracked THEN the system SHALL CONTINUE TO use tunnels.md with a markdown table

3.5 WHEN global state is tracked THEN the system SHALL CONTINUE TO use state.md with Active Wings, Recent Sessions, Current Focus, and Open Threads sections

3.6 WHEN user profile data is stored THEN the system SHALL CONTINUE TO use user-profile.md in its current markdown format

3.7 WHEN archived sessions are stored THEN the system SHALL CONTINUE TO use the archive/ directory structure with its existing organization

3.8 WHEN the phased implementation approach is followed THEN the system SHALL CONTINUE TO preserve all spec'd features for later phases — no features are cut, only deferred
