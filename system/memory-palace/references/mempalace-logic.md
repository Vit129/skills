# MemPalace Technical Reference

Detailed logic and implementation details adapted from the `milla-jovovich/mempalace` architecture.

## 1. Taxonomic Definitions

| Level | Name | Purpose | Data Type |
|-------|------|---------|-----------|
| 1 | **Wing** | Domain Isolation | Metadata / URI |
| 2 | **Room** | Semantic Context | Vector Cloud |
| 3 | **Closet** | Compressed State | AAAK MD |
| 4 | **Drawer** | Ground Truth | Verbatim Text |

## 2. AAAK (AI Agent Knowledge) Dialect Examples

**Inefficient (Standard English):**
"The portfolio currently holds 100 shares of AAPL bought at an average price of $150. The current strategy is to buy more if the price drops below $145 according to the DCA rules we established last week."

**Efficient (AAAK-style):**
`@Portfolio:Retire | Room:Stocks | Closet:State`
`$AAPL: { Q:100, Avg:150, Strat:[Buy@<145], Ref:DCAv2_Rule }`
`Status: Active | Updated: 2026-04-09`

## 3. Temporal Relationship Logic

Every fact in the system should be stored as a triple with a temporal dimension. This allows the AI to rebuild the state of the system at any point in history.

### The Triple Format

`{subject: string, predicate: string, object: string, metadata: {valid_from: timestamp, valid_to: timestamp | null}}`

**Example Queries:**

- "What was the active strategy for Crypto during the Dec 2025 market crash?"
- "Show me all Drawers (transactions) added since the last Rebalancing event."

## 4. Contradiction Detection

Before adding new information to a `Room` or `Drawer`:

1. **Search:** Look for existing active triples (`valid_to == null`) for the same subject/predicate.
2. **Verify:** Check if the new info contradicts the old info or defined strategy.
3. **Resolve:**
    - If it's an update: Set `valid_to` of the old triple to `now` and add the new triple.
    - If it's a contradiction: Alert user and request clarification.

## 5. Toolset Overview (Standard MCP Tools)

The framework defines 19 core tools for managing the Palace:

| Tool Category | Key Tools |
|---------------|-----------|
| **Hierarchy CRUD** | `add_wing`, `add_room`, `add_closet`, `add_drawer`, `delete_x` |
| **Relational** | `add_hall` (Intra-Wing), `add_tunnel` (Inter-Wing) |
| **Knowledge** | `add_fact` (Triples), `add_rule` (Logic), `get_fact_history` |
| **Retrieval** | `search` (Global), `search_rooms`, `get_taxonomy` |
| **Maintenance** | `prune_memory`, `clear_all` |
