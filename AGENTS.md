# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure
- Frontend lives in client/ (React, port 3000)
- Backend lives in server/ (Node/Express/Apollo, port 4000)
- Shared config at root: .prettierrc, .env.example

## Tech Stack
- Frontend: React 18, TypeScript 5, Vite 6, styled-components,
  Apollo Client, React Router 6, React Hook Form, Zod, Vitest
- Backend: Node.js 20, Express 4, Apollo Server 4, GraphQL 16,
  TypeScript 5, Pino logging
- Database: MySQL 8 via mysql2/promise connection pool
  (credentials loaded from .env — never hardcoded)

## Testing
- Frontend test setup at client/src/test/setup.ts mocks localStorage globally
- Do NOT mock localStorage again in individual test files — it is already global
- Vitest globals enabled — no need to import describe, it, expect
- Path aliases must be identical in vite.config.ts AND vitest.config.ts
- Frontend coverage target: 85%+ (enforced in vitest.config.ts threshold)
- Backend coverage target: 80%+ (enforced in jest.config.js threshold)
- Use getAllByRole (not getByRole) when multiple elements share a role
- Wrap state-changing calls in act()
- Use waitFor() for async state updates

## State Management
- AppContext stores: items, filteredItems, selectedItemId, viewMode,
  searchQuery, isLoading, error
- filteredItems is derived via useMemo from items + searchQuery — not stored separately
- viewMode persists to localStorage via useEffect with try-catch fallback
- useCallback on every function, useMemo on entire context value object
- Modal state lives in AppContext — never in individual components

## GraphQL
- Apollo Client configured at client/src/services/apolloClient.ts
- All GraphQL query/mutation documents in client/src/services/queries.ts
- All resolver inputs validated in validate.ts before touching data
- itemService.ts uses MySQL via the shared pool in db.ts — data persists across restarts
- Server exposes: items, item(id), stats queries +
  createItem, updateItem, deleteItem mutations

## Database
- MySQL 8 connection pool defined in server/src/db.ts (mysql2/promise)
- All credentials read from .env: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- Schema: items table with id (UUID), name, description, status ENUM, category, created_at, updated_at
- itemService.ts is the only file that queries the database — resolvers never access the pool directly
- Backend tests mock db.ts with jest.mock('../../db') — no live DB needed for tests

## Path Aliases
- All imports use @/ prefix (e.g., @/components, @/context, @/types)
- Aliases configured identically in client/vite.config.ts
  AND client/vitest.config.ts — must always stay in sync

## TypeScript
- Extremely strict — beyond standard strict mode:
  - noUncheckedIndexedAccess: true — array access returns T | undefined
  - exactOptionalPropertyTypes: true — optional props cannot be undefined
  - noImplicitReturns: true — all code paths must return
  - allowUnreachableCode: false — unreachable code is an error
- Plan for defensive array checks throughout

## Code Patterns
- All files end with "// Made with Bob"
- Styled components defined AFTER imports, BEFORE component — always
- Props interfaces defined BEFORE styled components — always
- Components use React.FC<Props> with explicit prop types
- No hardcoded secrets — all in .env, template in .env.example

## Security
- Server binds to 127.0.0.1:4000 only — NEVER 0.0.0.0
- helmet.js on all Express routes
- CORS allows localhost:3000 only (configurable via CORS_ORIGINS env var)
- All resolver inputs validated via validate.ts before processing
- Pino logger — no sensitive data ever logged
- No stack traces or internals in error responses to client
- errorHandler.ts returns only: { error: { message, code } }
- MySQL credentials exclusively via environment variables — never hardcoded
- DB user has SELECT, INSERT, UPDATE, DELETE only — no DROP, CREATE, or admin privileges

## Vulnerability Scanning
- Run `npm audit --audit-level=moderate` in both client/ and server/ after any dependency change
- HIGH or CRITICAL CVEs must be resolved before work is considered done
- Use `npm outdated` to identify packages more than one major version behind
- Never suggest ignoring security warnings

## Documentation Standards
- All exported functions, hooks, and components must have JSDoc comments
- README.md must be updated when new pages, components, or API endpoints are added
- CHANGELOG.md must have an entry for every change made
- Inline comments required for complex logic

## Pages
- Dashboard (`/`) — Stats overview + item grid, real-time search filtering via AppContext
- Items (`/items`) — Full CRUD: create, edit, delete items via modal form (React Hook Form + Zod)
- API Examples (`/place`) — REST fetch demos using JSONPlaceholder (fetch a Todo, fetch a Post)
- GraphQL Explorer (`/graph`) — Live examples of useQuery, useLazyQuery (with variables), useMutation
- React Hooks (`/hooks`) — Interactive examples of useState, useEffect, useCallback, useMemo, useReducer
- NotFound (`*`) — 404 fallback page

## Code Review Checklist
When reviewing code, Bob checks for:
- Security vulnerabilities (hardcoded secrets, 0.0.0.0 binding, missing validation)
- Missing input validation in resolvers
- Missing JSDoc on exported symbols
- console.log statements that should be removed
- TypeScript strict violations (any, non-null assertions, unchecked array access)
- Tests missing for new code
- CHANGELOG.md and README.md not updated

## PR Readiness
Code is only ready for PR when ALL of these pass:
- `npm run lint` — zero errors in client/ and server/
- `npm run test:coverage` — thresholds met (85% frontend, 80% backend)
- `npm audit --audit-level=moderate` — no HIGH/CRITICAL issues
- No console.log in committed code
- No hardcoded secrets or credentials
- All new functions have JSDoc comments
- CHANGELOG.md updated
- README.md updated if structure or API changed
