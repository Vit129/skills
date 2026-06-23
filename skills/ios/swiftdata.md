# SwiftData Reference

Use this reference when adding or changing local persistence, offline cache,
model queries, or data history.

Official docs:

- SwiftData: https://developer.apple.com/documentation/swiftdata
- Preserving model data: https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches
- Adding and editing persistent data: https://developer.apple.com/documentation/swiftdata/adding-and-editing-persistent-data-in-your-app
- Filtering and sorting persistent data: https://developer.apple.com/documentation/swiftdata/filtering-and-sorting-persistent-data
- Maintaining a local copy of server data: https://developer.apple.com/documentation/swiftdata/maintaining-a-local-copy-of-server-data
- Fetching and filtering time-based model changes: https://developer.apple.com/documentation/SwiftData/Fetching-and-filtering-time-based-model-changes

## Default Rule

Use SwiftData for new iOS 17+ persistence. Use Core Data when the project already
depends on it, needs older OS support, or has mature migration/store tooling.

## Model Rules

- Keep `@Model` types small and persistence-focused.
- Do not put network DTO concerns directly into persistent models.
- Use explicit mapping between DTOs, domain models, and SwiftData models when
  boundaries are meaningful.
- Keep unique identifiers stable and test migration behavior.
- Treat relationships, deletes, and cascade behavior as part of the data
  contract, not UI detail.

## Query and Cache Rules

- Use SwiftData as a local source of truth when the feature needs offline or
  launch-time continuity.
- Use SwiftData as a lightweight cache for server data only after defining
  freshness, invalidation, and conflict behavior.
- Keep filtering and sorting close to the query when it reduces memory and CPU
  work.
- Avoid doing large in-memory filters after fetching broad data sets.

## Change History

- Use SwiftData History when the app must process inserts, updates, and deletes
  over time, especially changes made by another process such as widgets or app
  intents.
- Store enough metadata to reconcile external changes and refresh visible state.
- Test history consumers with insert, update, delete, and no-op transactions.

## Testing

- Use an in-memory or isolated test store when the project supports it.
- Seed deterministic model data for unit and UI tests.
- Test migration paths before changing existing models in production apps.
- Keep persistence tests independent; do not share mutable stores across tests.

## Review Checks

- Persistence choice matches OS support and existing project architecture.
- Model, DTO, and domain boundaries are explicit.
- Cache invalidation and offline behavior are defined.
- Queries avoid broad fetches followed by expensive in-memory filtering.
- Migration and history behavior are tested when schema or cross-process changes
  matter.
