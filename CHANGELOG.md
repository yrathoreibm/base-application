# Changelog

All notable changes to the Base Application scaffold are documented here.

---

## [Unreleased]

### Added
- `src/db.ts` — Shared MySQL connection pool using `mysql2/promise`; reads all credentials from environment variables
- `server/src/__tests__/middleware/errorHandler.test.ts` — 4 unit tests for error handler and 404 handler
- `server/src/__tests__/middleware/requestLogger.test.ts` — 2 unit tests for request logger middleware
- `server/src/__tests__/utils/validate.test.ts` — 9 unit tests for `assertNonEmpty`, `assertValidStatus`, `assertMaxLength`
- `src/pages/Place.tsx` — REST API Examples page: fetch a Todo and a Post from JSONPlaceholder
- `src/pages/Graph.tsx` — GraphQL Explorer page: live `useQuery`, `useLazyQuery` (with variables), `useMutation` examples
- `src/pages/Hooks.tsx` — React Hooks Explorer page: interactive `useState`, `useEffect`, `useCallback`, `useMemo`, `useReducer` demos
- Routes `/place`, `/graph`, `/hooks` added to `src/routes/index.tsx`
- Sidebar navigation updated with links to all 5 pages

### Changed
- `src/services/itemService.ts` — Migrated from in-memory Map store to async MySQL CRUD using `mysql2/promise` connection pool
- `src/__tests__/services/itemService.test.ts` — Rewritten to mock the MySQL pool; all calls updated to `async/await`
- `src/__tests__/resolvers/itemResolvers.test.ts` — Updated all `mockReturnValue` → `mockResolvedValue` to match async service signatures; all tests updated to `async/await`
- All `.md` documentation files updated to reflect MySQL integration, 3 new pages, new test files, and correct file/test counts

### Security
- MySQL credentials accessed exclusively via environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)
- Database user granted minimum required privileges (SELECT, INSERT, UPDATE, DELETE only)
- Backend tests mock the DB pool — no live credentials required for CI/test runs

---

## [1.0.0] — Initial Scaffold

### Added

#### Project Configuration
- Monorepo structure with `client/` (frontend) and `server/` (backend) directories
- Shared `.prettierrc` with project-standard formatting rules
- `.env.example` template (no real secrets)
- `.gitignore` excluding `node_modules/`, `dist/`, `coverage/`, `.env`, logs

#### Backend (`server/`)
- `package.json` — Node.js 20, Express 4, Apollo Server 4, GraphQL 16, Pino, Helmet, CORS, dotenv
- `tsconfig.json` — TypeScript strict mode, ES2020 target, CommonJS modules
- `.eslintrc.json` — TypeScript ESLint with recommended type-checked rules
- `jest.config.js` — ts-jest preset, 80% coverage thresholds
- `src/index.ts` — Express + Apollo Server 4 entry; binds to 127.0.0.1; Helmet + CORS middleware; structured Pino logging
- `src/schema/typeDefs.ts` — GraphQL schema: `Item`, `Stats`, `ItemStatus` enum, `CreateItemInput`, `UpdateItemInput`; queries: `items`, `item`, `stats`; mutations: `createItem`, `updateItem`, `deleteItem`
- `src/resolvers/itemResolvers.ts` — Typed resolvers with full input validation
- `src/services/itemService.ts` — In-memory Map store with CRUD operations and seed data
- `src/models/item.ts` — `Item`, `CreateItemInput`, `UpdateItemInput` interfaces
- `src/middleware/errorHandler.ts` — Generic error handler (no stack traces to client) + 404 handler
- `src/middleware/requestLogger.ts` — Structured request logging via Pino
- `src/utils/logger.ts` — Pino logger (pretty in dev, JSON in production)
- `src/utils/validate.ts` — `assertNonEmpty`, `assertValidStatus`, `assertMaxLength` helpers

#### Frontend (`client/`)
- `package.json` — React 18, TypeScript 5, Vite 6, styled-components 6, React Router 6, Apollo Client 3, React Hook Form, Zod, Vitest, React Testing Library
- `tsconfig.json` — Full strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, path aliases
- `vite.config.ts` — React plugin, path aliases, dev proxy to backend, react-vendor code split chunk
- `vitest.config.ts` — jsdom environment, globals, setup file, v8 coverage, path aliases, 85% threshold
- `.eslintrc.json` — TypeScript + React + react-hooks + jsx-a11y + react-refresh rules
- `index.html` — Single-page HTML shell

#### Frontend Source
- `src/main.tsx` — Entry point: StrictMode → ErrorBoundary → ApolloProvider → ThemeProvider → GlobalStyles → AppProvider → RouterProvider
- `src/App.tsx` — Root layout: Header + Sidebar + MainContent with sidebar toggle state
- `src/styles/theme.ts` — Full design-system theme: colors, typography, spacing, borderRadius, shadows, breakpoints, zIndex, transitions
- `src/styles/GlobalStyles.ts` — CSS reset + base body styles via styled-components createGlobalStyle
- `src/types/index.ts` — `Item`, `Stats`, `ItemStatus`, `ViewMode`, `ApiResponse<T>`, `ApiError`, `AppState`, `AppContextValue`, utility types, `BaseComponentProps`
- `src/context/AppContext.tsx` — Full context with `useCallback`/`useMemo`, localStorage persistence, derived `filteredItems`, `useAppContext` hook
- `src/services/apolloClient.ts` — Apollo Client with InMemoryCache and network-only query policy
- `src/services/queries.ts` — GraphQL query/mutation documents: GET_ITEMS, GET_ITEM, GET_STATS, CREATE_ITEM, UPDATE_ITEM, DELETE_ITEM
- `src/data/seedData.ts` — Static seed item array
- `src/components/layout/Header.tsx` — Fixed top nav with search input and hamburger toggle; fully accessible
- `src/components/layout/Sidebar.tsx` — 340px fixed left nav with NavLink active styling; mobile drawer
- `src/components/layout/MainContent.tsx` — Flexible content area with responsive margins
- `src/components/common/ErrorBoundary.tsx` — Class-based error boundary with fallback UI
- `src/components/ui/Button.tsx` — 4 variants (primary/secondary/danger/ghost), 3 sizes, loading spinner, full a11y
- `src/components/ui/Card.tsx` — Clickable/selectable article element with keyboard navigation
- `src/components/ui/Badge.tsx` — Status badge with 4 color variants + `statusToBadgeVariant` helper
- `src/components/ui/LoadingSpinner.tsx` — Animated spinner with accessible label
- `src/components/ui/EmptyState.tsx` — Empty state with optional CTA action slot
- `src/components/ui/Modal.tsx` — Accessible dialog: role=dialog, aria-modal, aria-labelledby, Escape key, backdrop click
- `src/pages/Dashboard.tsx` — Stats row + item grid using Apollo `useQuery`, context-driven filtering
- `src/pages/ItemsPage.tsx` — Full CRUD page: Apollo queries/mutations, React Hook Form + Zod validation, modal form
- `src/pages/NotFoundPage.tsx` — 404 page with back-to-home link
- `src/routes/index.tsx` — React Router v6 `createBrowserRouter` config

#### Tests
- `src/test/setup.ts` — Full localStorage mock, beforeEach/afterEach lifecycle hooks, jest-dom import
- `src/components/ui/__tests__/Button.test.tsx` — 11 tests
- `src/components/ui/__tests__/Badge.test.tsx` — 11 tests (including `statusToBadgeVariant`)
- `src/components/ui/__tests__/Card.test.tsx` — 7 tests (including keyboard nav)
- `src/components/ui/__tests__/LoadingSpinner.test.tsx` — 5 tests
- `src/components/ui/__tests__/EmptyState.test.tsx` — 6 tests
- `src/components/ui/__tests__/Modal.test.tsx` — 6 tests (including Escape key + aria)
- `src/components/layout/__tests__/Header.test.tsx` — 7 tests
- `src/components/layout/__tests__/MainContent.test.tsx` — 4 tests
- `src/context/__tests__/AppContext.test.tsx` — 12 tests (state transitions, localStorage, filtering, error handling)
- `src/__tests__/integration.test.tsx` — 4 integration tests covering the main dashboard workflow
- `server/src/__tests__/services/itemService.test.ts` — 9 unit tests
- `server/src/__tests__/resolvers/itemResolvers.test.ts` — 12 unit tests
