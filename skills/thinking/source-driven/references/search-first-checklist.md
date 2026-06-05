# Search-First Checklist

> Before implementing framework-specific code, VERIFY the API/pattern still exists.
> Adapted from ECC's `search-first` and `documentation-lookup` skills.

---

## When to Apply

- Using a library/framework you haven't used in 30+ days
- Implementing a pattern from memory (not from docs)
- Using an API that might have breaking changes (e.g., Playwright, Next.js, React)
- When the agent says "I believe this API..." without citing a source

---

## Checklist (Before Writing Code)

### 1. Identify the Claim
```
What API/pattern am I about to use?
→ e.g., "page.waitForSelector() with { state: 'visible' }"
```

### 2. Search for Official Source
```
Where is this documented?
→ Official docs URL
→ Version-specific page
→ Changelog if recently changed
```

### 3. Verify Version Compatibility
```
Is this API available in OUR version?
→ Check package.json / requirements.txt for installed version
→ Check if API was added/deprecated in a specific version
```

### 4. Cite the Source
```
[from: playwright.dev/docs/api/class-page#page-wait-for-selector]
```

---

## Red Flags (Trigger Deeper Research)

| Signal | Risk | Action |
|--------|------|--------|
| "I think this API..." | Hallucination risk | Search docs first |
| Using deprecated pattern | Will break on upgrade | Find current alternative |
| Copy-pasting from memory | May be outdated | Verify against latest docs |
| Framework major version change | Breaking changes likely | Read migration guide |
| No official docs found | API might not exist | Test in isolation first |

---

## Integration with AIDLC

- **Phase 2 (Task Design):** Verify tech stack assumptions
- **Phase 3 (Implementation):** Apply checklist before each framework-specific task
- **Debugging:** When tests fail with "method not found" → likely a version mismatch

---

## Citation Format

When citing sources in code or docs:
```
[from: skill:thinking/source-driven] — verified against playwright.dev v1.44
```

---

## Rules

- **Never implement from memory alone** for framework-specific APIs
- **Always check version** — what works in v1.40 may not exist in v1.44
- **Cite your source** — future maintainers need to know where patterns came from
- **If unsure, test first** — write a minimal reproduction before full implementation
