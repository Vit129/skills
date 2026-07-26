# Paused Gates

<!-- Any skill's named HITL gate (a real pause point by design — e.g. debug-mantra-workflow's
repro-confirmed/hypothesis-picked/fix-approved/fix-validated — not a plain "ask the user"
moment) appends an entry here when it pauses, in case the session ends before the user answers.
session-start.sh scans this file and surfaces every `Status: OPEN` entry at the top of the next
session's context so work resumes at the right point instead of restarting cold.

Mark `Status: RESOLVED` (or delete the entry outright) the moment the gate's question gets
answered and the skill continues — don't let resolved entries pile up here.

Template for a new entry (write the literal word OPEN, not this placeholder, when you use it):
## GATE-{NNN}
- Status: <OPEN|RESOLVED>
- Skill: {skill name, e.g. debug-mantra-workflow}
- Gate: {gate name, e.g. hypothesis-picked}
- Context: {feature/bug slug or one-line description of what this is}
- Paused: {ISO8601 timestamp}
- Question: {exactly what's pending from the user}
- Evidence so far: {short summary, or a path to fuller notes if there's a plans/[FEATURE]/ dir}
-->
