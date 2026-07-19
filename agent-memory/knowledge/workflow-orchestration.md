# Workflow Orchestration Patterns

## Fixed-dimension pipeline vs. self-selecting flock

Two ways to structure a multi-agent `Workflow` fan-out. Pick by whether the
set of things worth finding is knowable upfront.

- **Fixed-dimension pipeline** (default, use when the dimensions ARE known):
  hand each agent a pre-assigned slice (e.g. `DIMENSIONS = [bugs, perf,
  security]` for a diff review). This is the canonical pattern the Workflow
  tool documents. The problem is decomposable and predictable —
  "complicated" in the Cynefin sense — so a pre-planned split is strictly
  better: no wasted agent-slots, full coverage guaranteed.

- **Self-selecting flock** (use only when dimensions/coverage are NOT
  knowable upfront — a broad audit, a cross-project sweep, "find anything
  worth flagging"): give every agent the same 3 rules instead of an
  assignment, and let it pick its own target:
  1. **Separation** — don't pick something already covered by a prior round.
  2. **Alignment** — hold the same evidence bar as every other agent (cite
     real file:line, no speculation).
  3. **Cohesion** — stay grounded in the actual code/target you picked, don't
     drift into generic commentary.
  The coverage structure emerges from the interaction instead of being
  planned — this is the "adaptive engineering" pattern (few rules + let the
  harness self-organize) applied to Workflow fan-out specifically. It is
  the one place in this workspace where genuinely complex, unplannable
  coordination shows up (see the multi-agent-coordination finding below) —
  everything else in this repo's pipeline (`rules/routing.md`) is correctly
  complicated and should stay a fixed chain.

## Batch size vs. collision rate (measured, not theoretical)

`parallel()` agents in the same round run truly concurrently with **no
real-time visibility of each other** — unlike real flocking birds, they
cannot see a sibling's pick before making their own. This breaks the
separation rule within a round.

Live experiment (2026-07-19, 13-repo cross-project audit, 5 agents/round x
2 rounds, no fixed assignment): **4 of 10 agent-slots collided** — landed on
a repo another same-round agent had already independently picked — reducing
effective coverage from a theoretical 10 unique repos to 6. Findings from
the collided agents were still valid (often complementary angles on the
same file), but the collision itself was pure waste of that agent-slot's
"could have covered something new" potential.

**Fix: use a batch size of 2-3 concurrent agents per round, not 5+**, when
running the flock pattern. Smaller batches trade wall-clock time for a lower
collision rate — a direct, measured trade-off, not a guess. If the round
must be larger for wall-clock reasons, expect and accept a collision tax
proportional to batch size; don't rely on the rules alone to prevent it.

## Reference

Full 13-repo flock-review experiment (findings, collision log, token cost:
646,944 tokens / 205 tool calls / 10 agents) — see the conversation that
also fixed `scripts/eval-scheduler.sh` (dead `.kiro` paths) on 2026-07-19,
triggered by a discussion of "adaptive engineering" (Cynefin complicated vs.
complex framing) and a Fable-advisor audit of this workspace's own
routing.md against that framing.
