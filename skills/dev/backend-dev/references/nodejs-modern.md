# Modern Node.js Backend Reference

Use this reference for Node.js backend work with TypeScript, ESM, Express,
Fastify, NestJS, native test runner, Fetch, streams, workers, and runtime
configuration.

Read `nodejs.md` first for local architecture patterns, then apply this file for
current Node runtime rules.

## Official Documentation Anchors

- Node.js current docs: https://nodejs.org/api/
- ECMAScript modules: https://nodejs.org/api/esm.html
- Node TypeScript support: https://nodejs.org/api/typescript.html
- Node test runner: https://nodejs.org/api/test.html
- Fetch global: https://nodejs.org/api/globals.html#fetch
- Packages: https://nodejs.org/api/packages.html
- Errors: https://nodejs.org/api/errors.html
- Streams: https://nodejs.org/api/stream.html

## Runtime Rules

- Prefer the active LTS for production unless the project explicitly targets
  current Node.
- Use TypeScript for new backend code.
- Treat the module system as an architectural decision. Do not mix ESM and
  CommonJS casually.
- For ESM, use explicit relative file extensions and `node:` imports for built
  in modules, for example `import { readFile } from 'node:fs/promises'`.
- Validate environment variables at startup and fail fast on missing config.

## HTTP and Framework Rules

- Keep controllers thin and delegate business logic to services.
- Validate request input at the edge with Zod, Joi, class-validator, or the
  project standard.
- Prefer structured error objects and centralized error handling.
- Use framework-native lifecycle hooks for graceful shutdown.
- Apply auth middleware by default unless a route is explicitly public.

## Fetch and Network

- Node's Fetch API is powered by Undici.
- Always consume or cancel response bodies.
- Set explicit timeouts or cancellation with `AbortController`.
- Do not hide retries inside low-level clients unless retry policy is part of
  the contract.

## Testing

- Use the project test runner first. Native `node:test` is acceptable for
  focused libraries or services when the project already supports it.
- Keep unit tests isolated from network and databases.
- Use integration tests for route validation, auth, error handling, and
  persistence boundaries.
- Run TypeScript checks separately from test execution.

## Review Checklist

- Runtime version and module system are explicit.
- Input validation exists on every new endpoint.
- Errors are centralized and user-safe.
- Env vars are validated at startup.
- No secrets are committed.
- Async resources shut down cleanly.
- Tests and type checks run with real project commands.
