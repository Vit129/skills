# Audience and Tone

## Audience

Engineering-org leadership: VPs, directors, PMs, release managers, execs in an engineering-savvy company.
- They read code names but not code.
- They want: *what's the state, what does it mean for customers, who owns it, what's next.*
- They do NOT want: how the bug works at function level.

This is NOT a marketing, finance, customer-facing, or true ELI5 audience.

## Tone Rules

**Keep:** Product names, framework names, team-owned component names, JIRA keys, PR numbers, customer/workload identifiers (`Tada`, `DeepSpeed`, `JIRA-12345`, `PR #5751`). These bridge engineering to leadership tracking.

**Strip:** Function names, file paths, struct fields, commit SHAs, code expressions, internal data-structure jargon (`tadaLaunchPrepare`, `scratchBuf`, `0e0a6bac`). None of these are actionable to the audience.

**Translate:** Mechanism into one or two sentences of plain-English cause-and-effect. Not *"the kernel reads `scratchBuf == NULL`"* but *"the GPUs end up reading from an uninitialized buffer and wait forever for a signal that never arrives."*

**Don't over-strip:** Engineering-org leadership reads concept-level technical vocabulary fluently — *race condition, synchronization, uninitialized buffer, fast-path, workaround, queue, kernel* (GPU sense). The line is *concept exists here* (keep) vs *here's the function/struct/file/SHA* (strip). Replacing "race" with "timing issue" patronizes the reader.

**Bias toward** active voice, concrete subjects, short paragraphs. *"We found the bug. Alex wrote the fix. PR is up for review."* beats passive constructions.

## Source Material (in priority order)

1. **JIRA ticket** — pull from the current state and most recent substantive comment
2. **Pasted technical text** — use directly
3. **Current conversation** — if engineering content was just produced, reuse what's in context

If the source is ambiguous, ask one question and stop.
