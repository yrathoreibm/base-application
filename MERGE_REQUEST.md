# Merge Request: Base Application Scaffold — v1.1.0

## Summary

This MR delivers the **Base Application** — a production-ready full-stack starter built with React 18, TypeScript 5, Vite, Node.js 20, Express, Apollo Server 4, GraphQL, and **MySQL 8**. It is intentionally minimal and domain-agnostic so teams can layer their real product features on top.

---

## What Was Built

### Backend
- Express + Apollo Server 4 integrated API server
- Binds exclusively to `127.0.0.1` (security requirement met)
- Helmet.js + CORS (localhost only) security middleware
- Structured Pino JSON logging (no sensitive data in logs)
- GraphQL schema: `Item`, `Stats`, `ItemStatus`, `CreateItemInput`, `UpdateItemInput`
- Full CRUD resolvers with input validation (`assertNonEmpty`, `assertMaxLength`, `assertValidStatus`)
- **MySQL 8 data layer** — `db.ts` provides a `mysql2/promise` connection pool; `itemService.ts` is the sole consumer
- All DB credentials loaded from `.env` — never hardcoded; least-privilege DB user (SELECT, INSERT, UPDATE, DELETE only)
- Generic error handler returning no stack traces or internal details to clients
- TypeScript strict mode with all recommended strictness flags enabled

### Frontend
- Vite + React 18 + TypeScript 5 SPA with full strict-mode TypeScript
- Design system: `theme.ts` with colours, typography, spacing, breakpoints, z-index, transitions
- Global CSS reset via `styled-components` `createGlobalStyle`
- Three-tier layout: Header (fixed 60px) + Sidebar (340px) + MainContent
- Mobile-responsive: sidebar collapses to drawer below 768px
- Full AppContext with `useCallback`/`useMemo`, localStorage persistence, derived filtered items
- Apollo Client integrated with context (GraphQL queries hydrate global state)
- 6 reusable UI components: Button, Card, Badge, LoadingSpinner, EmptyState, Modal — all WCAG AA compliant
- **5 pages:** Dashboard (`/`), Items (`/items`), API Examples (`/place`), GraphQL Explorer (`/graph`), React Hooks (`/hooks`)
  - **Place** — REST fetch demos (JSONPlaceholder Todo + Post endpoints)
  - **Graph** — Live GraphQL: `useQuery`, `useLazyQuery` with variables, `useMutation` with `refetchQueries`
  - **Hooks** — Interactive React Hooks Explorer: `useState`, `useEffect`, `useCallback`, `useMemo`, `useReducer`
- Error boundary wrapping the entire application
- Code splitting: react-vendor chunk separated at build time

### Tests
- **Frontend**: 73+ test cases across UI components, layout, AppContext, and integration
  - Coverage target: 85%+
- **Backend**: 39 unit tests across resolvers, service layer, middleware, and utils
  - MySQL pool fully mocked — no live DB connection required to run tests
  - Coverage target: 80%+
- All tests follow Arrange-Act-Assert pattern with descriptive names

---

## Security Checklist

- [x] Server binds to `127.0.0.1` only — never `0.0.0.0`
- [x] No hardcoded secrets — `.env` file with `.env.example` template
- [x] Helmet.js enabled on all responses
- [x] CORS restricted to `localhost:3000`
- [x] Input validation on all GraphQL resolver arguments
- [x] Generic error messages returned to clients (no stack traces)
- [x] No sensitive data in logs
- [x] All packages are latest stable versions (no EOL)
- [x] MySQL credentials exclusively via environment variables
- [x] DB user has minimum required privileges (SELECT, INSERT, UPDATE, DELETE only)

---

## Testing

```bash
# Frontend
cd base-application/client
npm install
npm run test:coverage

# Backend
cd base-application/server
npm install
npm run test:coverage
```

---

## How to Review

1. Start with `server/src/index.ts` → `schema/typeDefs.ts` → `resolvers/itemResolvers.ts`
2. Then `client/src/main.tsx` → `App.tsx` → `context/AppContext.tsx`
3. Review UI components in `components/ui/` and their `__tests__/` directories
4. Check pages: `Dashboard.tsx` and `ItemsPage.tsx`
5. Verify security: grep for `0.0.0.0`, `console.log`, `hardcoded`, `password` — should return nothing relevant

---

## Notes for Reviewers

- The domain is generic (`Item`). The first action after merge should be replacing `Item` with the real domain entity.
- The MySQL schema is minimal. Add indexes, foreign keys, and migrations (Flyway/Liquibase) before production use.
- Authentication is intentionally omitted. Add SAML/OIDC as the next step.
- Run `Database Setup` steps from `README.md` before starting the server — the app will not start without a valid DB connection.
