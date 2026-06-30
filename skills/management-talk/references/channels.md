# Channel Shapes

## JIRA Comment / Written Status Report

Full structured block with bolded section labels. Easy to scan from a ticket page.

Building blocks (use as many as fit):
- **Status / TL;DR.** One bolded line. Reader can stop here and have the right answer. *"Fixed — pending merge."* / *"Root cause unknown — investigating."* / *"Blocked on vendor."*
- **Impact.** Who's affected, how badly, what they see. Customer/workload/product terms, not test-suite terms.
- **What broke.** Short paragraph. Plain-English mechanism, one level of why, no code identifiers.
- **Why now / how it slipped through.** Optional. Include when leadership will ask anyway.
- **Owner.** Person + team + PR/branch/JIRA artifact. One link, not five.
- **Next steps.** Concrete, near-term, ordered.
- **Workaround / mitigation.** If customers are hitting it now, what can they do today?
- **Risk.** Real risks only — don't manufacture risk to look thorough.

Order by what matters most for *this* item.

## Slack — Channel Post or DM

Single message, no walls of text. Heavy bolded section labels read "I escaped from JIRA" — don't.

- One **bolded TL;DR** line
- 2–3 bullets max — no labels
- If it's a **thread reply**, lose the TL;DR — just lead with the answer

Length target: under ~80 words top-level post; under ~40 words for a thread reply.

## Async Standup Note

Audience scans 10 notes in 30 seconds. Front-load the verb.

- 1–3 lines, max
- Pattern: *`<state> <thing>. <owner if not me>. <next>.`*
- Examples:
  - *"Fixed Tada hang affecting dumbModel runs (JIRA-12345). PR #5751 in review. Backport to v7.2 next."*
  - *"Still chasing LLM-7B eval-step hang. Reproducer reliable now; bisecting. No ETA yet."*
- No bullets, no bolded labels. The format IS the sentence.

## Email — Internal Exec / Cross-Team

Subject line is half the value.

- **Subject:** TL;DR rewritten as a noun phrase. *"Tada hang in dumbModel: fix in review (JIRA-12345)."*
- **Greeting:** Match recipient register (*Hi Sam,* / *Hi all,*)
- **Body:** JIRA-comment shape, but flowing paragraphs separated by blank lines, no bolded section labels. Two or three paragraphs is plenty.
- **Sign off** with the next decision point that needs the recipient's attention. If none, plain *"— [Name]"* is fine.

## Meeting Talking Points

You're going to *say* this, not show it.

- Bullet list, max one short clause per bullet
- Order: the order you'll speak in
- Include numbers/keys you want to reference out loud, in the bullet itself
- Skip prose — just *"dumbModel LLM-7B fine-tuning hanging."* / *"Root cause: skipped sync in Tada fast-path."* / *"Alex's fix in review, PR #5751."*

---

## Worked Example (same bug, three channels)

**JIRA comment:**
> **Status:** Fixed — pending merge. (JIRA-12345, PR #5751)
>
> **Impact:** Affects all customers using dumbModel for LLM-7B (or larger) fine-tuning on 4+ GPUs — workload hangs at first eval step on every run. Workaround: disable IPC registration.
>
> **What broke:** GPU communication library (Tada) skipped an internal synchronization step under the specific configuration that dumbModel happens to trigger. GPUs ended up reading from an uninitialized buffer and got stuck waiting for a signal that would never arrive.
>
> **Owner:** Alex (Tada team). PR org/platform#5751.
>
> **Next steps:** code review → merge → backport to v7.2.

**Slack post:**
> **Tada hang affecting dumbModel LLM-7B fine-tuning fixed — pending merge.** (JIRA-12345)
> - Skipped sync in Tada's fast-path → GPUs read uninitialized memory → hang. Latent for months; dumbModel was the first workload to hit it.
> - Owner: Alex, PR #5751 in review. Workaround: disable IPC registration.

**Standup note:**
> Fixed Tada hang on dumbModel LLM-7B (JIRA-12345). Alex's PR #5751 in review. Workaround posted in ticket; backport to v7.2 next.
