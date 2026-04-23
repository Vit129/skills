# 📊 Postman → Playwright Migration Progress

**Collection:** `{collection_name}`
**Total Folders:** {N}
**Started:** {date}

---

## Step 1+2: JSON → Markdown (USER runs in terminal)

| # | Folder | Script | Status |
|---|--------|--------|--------|
| 1 | `{folder_1}` | readPostmanCollection.ts | ⬜ pending |
| 2 | `{folder_2}` | readPostmanCollection.ts | ⬜ pending |
| 3 | `{folder_3}` | readPostmanCollection.ts | ⬜ pending |
| — | Environment | readPostmanEnv.ts | ⬜ pending |

> ✅ = completed, ⬜ = pending, ❌ = failed

---

## Step 2.5: AI Design Structure

| Task | Status |
|------|--------|
| Read `## 🏗️ Structure Summary` from collection.md | ⬜ pending |
| Read `## 🏗️ Env Summary` from env.md | ⬜ pending |
| Propose file structure to user | ⬜ pending |
| User approved structure | ⬜ pending |

---

## Step 3: Markdown → Playwright (AI generates)

| # | Folder | .spec.ts | Helper.ts | Service.ts | Data.ts | .env | Status |
|---|--------|----------|-----------|------------|---------|------|--------|
| 1 | `{folder_1}` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ pending |
| 2 | `{folder_2}` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ pending |
| 3 | `{folder_3}` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ pending |

### Shared Files

| File | Status |
|------|--------|
| `CollectionHelpers.ts` | ⬜ pending |
| `.env.sit` | ⬜ pending |
| Shared services | ⬜ pending |

---

## Step 4: Run Tests → Fix Failures (USER runs, AI fixes)

| # | Folder | Tests Run | Pass | Fail | Fix Status |
|---|--------|-----------|------|------|------------|
| 1 | `{folder_1}` | ⬜ | — | — | ⬜ pending |
| 2 | `{folder_2}` | ⬜ | — | — | ⬜ pending |
| 3 | `{folder_3}` | ⬜ | — | — | ⬜ pending |

---

## Summary

| Step | Progress |
|------|----------|
| Step 1+2: JSON → Markdown | 0/{N} folders |
| Step 2.5: Design Structure | ⬜ not started |
| Step 3: Generate Playwright | 0/{N} folders |
| Step 4: Run & Fix Tests | 0/{N} folders |

**Overall: 0% complete**
