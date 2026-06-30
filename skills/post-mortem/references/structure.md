# Post-Mortem Structure

Use these blocks in order. **Summary, Root cause, Fix, and Validation are mandatory.**

## 1. Summary _(mandatory)_
One paragraph. What broke, in user/workload terms. What fixed it, in one sentence. JIRA key, PR number, owner. A reader who stops here should have the right answer.

## 2. Symptom
What was actually observed. Test output, error message, log line, perf number, customer report. Concrete identifiers — don't paraphrase the failure mode.

## 3. Root cause _(mandatory)_
The actual bug mechanism. Code identifiers welcome and expected — function names, file paths, struct fields, branch conditions, commit SHAs. Walk the cause chain end-to-end.

## 4. Why it produced the symptom
Link the root cause to the symptom. Walk the chain so a reader who only knows the symptom can connect it back to the cause without re-deriving it.

## 5. Fix _(mandatory)_
What changed and **why this change addresses the root cause** rather than hiding the symptom. Link to PR / commit. If a previous fix attempt papered over the symptom, name it and explain what was wrong with it.

## 6. How it was found
Short. The debugging path:
- What repro made it deterministic
- What tools cracked it (debugger, source tracing, instrumentation)
- Hypotheses tried and rejected, with the one-line reason each was rejected
- The single experiment that confirmed the cause

## 7. Why it slipped through
What allowed this bug to reach the branch / release / customer. Pick the real reason:
- CI gap (no test exercises this path / configuration)
- Latent code (correct when written, broken by a later change)
- Workload gap (no real workload reached this code path until now)
- Incomplete prior fix (defensive check hid the symptom; root cause untouched)
- Review miss (the change was reviewable; the implication wasn't)

If the honest answer is "no good reason," say so. **Blameless** — describe the gap, not the person.

## 8. Validation _(mandatory)_
How we know the fix works. Concrete:
- Original failing test now passes (test name, link)
- Customer workload now completes (workload identifier, run link)
- Perf regression resolved (number before, number after)

If you only validated one configuration, say so explicitly. Don't imply broader coverage than you have.

## 9. Action items / follow-ups
Concrete next-steps that aren't in the fix PR itself. Each item: what + owner + tracking artifact.

If there are no action items, write *"None — the fix is sufficient."* Don't manufacture action items.

---

## Worked Example (Tada hang in dumbModel)

> **Summary.** Tada's single-stream fast-path skipped a required cross-stream synchronization, causing kernels to launch before scratch-buffer writes were visible. Triggered reliably by dumbModel on LLM-7B fine-tuning, hanging the workload at every eval step. Fixed by removing the unsafe fast-path and tightening a device-side check. JIRA-12345, PR org/platform#5751, owner Alex (Tada team).
>
> **Symptom.** 8-GPU LLM-7B fine-tuning under dumbModel hung indefinitely at the first eval step. No error, no timeout — busy-spin in `tadaKernel_AllReduce_f32_RING`. Reproduced on every run.
>
> **Root cause.** The single-stream fast-path in `tadaLaunchPrepare` / `tadaLaunchKernel` / `tadaLaunchFinish` (gated on `scheduler->numStreams == 1 && !plan->persistent`) skipped the cross-stream event between `launchStream` and `handle->shared->deviceStream`. dumbModel hits this gate exactly. The kernel was launched before the IPC publish / scratch-buffer writes (which populate `scratchBuf`) were visible to `launchStream`. In the kernel: `scratchBuf == NULL` → stray pointer dereference → ring ready-flag read from garbage memory → thread spins forever.
>
> **Fix.** PR #5751 removes the single-stream fast-path entirely and adds a device-side null check on `scratchBuf`. A previous attempt (PR #5612) added a host-side defensive check that hid the symptom in some paths but left the underlying race in place — that change is also reverted.
>
> **Validation.** Original LLM-7B / 8-GPU / dumbModel workload now completes a full eval pass cleanly (3 consecutive 2-hour runs). `tada-tests` regression suite green. Not retested on other model sizes — those go through the multi-stream path and were never affected.
