# Base Application — Full-Stack Scaffold

A modular full-stack base framework built with **React 18**, **TypeScript 5**, **Vite**, **Node.js 20**, **Express**, **Apollo Server 4**, **GraphQL**, and **MySQL**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 6, styled-components, React Router 6, Apollo Client 3 |
| Backend | Node.js 20, Express 4, Apollo Server 4, GraphQL 16, TypeScript 5 |
| Database | MySQL 8 (via `mysql2/promise` connection pool) |
| Testing | Vitest + React Testing Library (frontend), Jest + ts-jest (backend) |
| Security | Helmet.js, CORS, Pino structured logging, input validation |

---

## Project Structure

```
base-application/
├── .env.example                        # Environment variable template (no real secrets)
├── .prettierrc                         # Shared Prettier formatting config
├── .gitignore                          # Excludes node_modules, dist, coverage, .env
│
├── client/                             # React + TypeScript frontend (Vite)
│   ├── src/
│   │   ├── __tests__/                  # Integration tests
│   │   ├── components/
│   │   │   ├── layout/                 # Header, Sidebar, MainContent
│   │   │   │   └── __tests__/
│   │   │   ├── ui/                     # Button, Card, Badge, LoadingSpinner, EmptyState, Modal
│   │   │   │   └── __tests__/
│   │   │   └── common/                 # ErrorBoundary
│   │   ├── context/                    # AppContext (global state + localStorage)
│   │   │   └── __tests__/
│   │   ├── pages/                      # Dashboard, ItemsPage, NotFoundPage
│   │   ├── routes/                     # React Router config
│   │   ├── services/                   # Apollo Client + GraphQL query documents
│   │   ├── hooks/                      # Custom hooks (ready to extend)
│   │   ├── types/                      # TypeScript interfaces
│   │   ├── styles/                     # theme.ts + GlobalStyles.ts
│   │   ├── data/                       # Seed data
│   │   └── test/                       # Vitest global setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
└── server/                             # Node.js + Express + Apollo Server backend
    ├── src/
    │   ├── db.ts                       # MySQL connection pool (mysql2/promise)
    │   ├── index.ts                    # Express + Apollo Server entry point
    │   ├── schema/                     # GraphQL type definitions
    │   ├── resolvers/                  # GraphQL resolvers
    │   ├── services/                   # itemService (MySQL CRUD)
    │   ├── middleware/                 # errorHandler, requestLogger
    │   ├── models/                     # TypeScript interfaces
    │   ├── utils/                      # logger (Pino), validate
    │   └── __tests__/                  # Jest test suites
    │       ├── middleware/
    │       ├── resolvers/
    │       ├── services/
    │       └── utils/
    ├── package.json
    ├── tsconfig.json
    └── jest.config.js
```

---

## Prerequisites

- **Node.js** v20 or higher
- **npm** v9 or higher
- **MySQL** v8 or higher (running locally or via Docker)

---

## Database Setup

The server uses a MySQL database. You must create the database and table before starting the server.

### 1. Create the database and table

Connect to your MySQL instance and run:

```sql
CREATE DATABASE IF NOT EXISTS base_application_framework;
USE base_application_framework;

CREATE TABLE IF NOT EXISTS items (
  id           VARCHAR(36)                            NOT NULL,
  name         VARCHAR(120)                           NOT NULL,
  description  VARCHAR(500)                           NOT NULL,
  status       ENUM('active', 'pending', 'inactive')  NOT NULL DEFAULT 'pending',
  category     VARCHAR(120)                           NOT NULL,
  created_at   DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME                               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

### 2. Create a database user (recommended)

```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON base_application_framework.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## Getting Started

### 1. Configure environment

```bash
cd base-application
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials:

```env
PORT=4000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=base_application_framework
DB_USER=appuser
DB_PASSWORD=your_password_here
```

### 2. Install backend dependencies

```bash
cd base-application/server
npm install
```

### 3. Install frontend dependencies

```bash
cd base-application/client
npm install
```

---

## Running the Application

Both servers must run simultaneously. Open two terminal windows.

### Terminal 1 — Start the backend

```bash
cd base-application/server
npm run dev
```

- Server: `http://127.0.0.1:4000`
- GraphQL endpoint: `http://127.0.0.1:4000/graphql`
- Health check: `http://127.0.0.1:4000/health`

### Terminal 2 — Start the frontend

```bash
cd base-application/client
npm run dev
```

- Frontend: `http://localhost:3000` (opens automatically)

---

## GraphQL API

### Queries

```graphql
query GetItems {
  items { id name description status category createdAt updatedAt }
}

query GetItem($id: ID!) {
  item(id: $id) { id name description status category createdAt updatedAt }
}

query GetStats {
  stats { total active pending inactive }
}
```

### Mutations

```graphql
mutation CreateItem($input: CreateItemInput!) {
  createItem(input: $input) { id name status category createdAt updatedAt }
}

mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
  updateItem(id: $id, input: $input) { id name status category updatedAt }
}

mutation DeleteItem($id: ID!) {
  deleteItem(id: $id)
}
```

### Input Types

```graphql
input CreateItemInput {
  name: String!        # max 120 chars
  description: String! # max 500 chars
  status: ItemStatus!
  category: String!
}

input UpdateItemInput {
  name: String         # all fields optional
  description: String
  status: ItemStatus
  category: String
}

enum ItemStatus {
  active
  pending
  inactive
}
```

---

## Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Stats overview + item grid, real-time search filtering |
| Items | `/items` | Full CRUD — create, edit, delete items via modal form (React Hook Form + Zod) |
| API Examples | `/place` | REST fetch demos via JSONPlaceholder — fetch a Todo, fetch a Post |
| GraphQL Explorer | `/graph` | Live examples of `useQuery`, `useLazyQuery` (with variables), `useMutation` |
| React Hooks | `/hooks` | Interactive demos of `useState`, `useEffect`, `useCallback`, `useMemo`, `useReducer` |
| Not Found | `*` | 404 page with back-to-home link |

---

## Testing

### Frontend (Vitest + React Testing Library)

```bash
cd base-application/client
npm test                 # run in watch mode
npm run test:coverage    # run with coverage report
npm run test:ui          # open interactive Vitest UI
```

Coverage target: **85%+** (enforced — build fails if not met)

**Test files:**

| File | Tests |
|---|---|
| `components/ui/__tests__/Button.test.tsx` | 11 |
| `components/ui/__tests__/Badge.test.tsx` | 11 |
| `components/ui/__tests__/Card.test.tsx` | 7 |
| `components/ui/__tests__/LoadingSpinner.test.tsx` | 5 |
| `components/ui/__tests__/EmptyState.test.tsx` | 6 |
| `components/ui/__tests__/Modal.test.tsx` | 6 |
| `components/layout/__tests__/Header.test.tsx` | 7 |
| `components/layout/__tests__/MainContent.test.tsx` | 4 |
| `context/__tests__/AppContext.test.tsx` | 12 |
| `__tests__/integration.test.tsx` | 4 |

### Backend (Jest + ts-jest)

```bash
cd base-application/server
npm test                 # run all tests
npm run test:coverage    # run with coverage report
```

Coverage target: **80%+** (enforced — build fails if not met)

> **Note:** Backend tests mock the MySQL pool (`db.ts`) — no live database connection is required to run tests.

**Test files:**

| File | Tests | Covers |
|---|---|---|
| `__tests__/services/itemService.test.ts` | 9 | MySQL CRUD via mocked pool |
| `__tests__/resolvers/itemResolvers.test.ts` | 12 | All queries + mutations |
| `__tests__/middleware/errorHandler.test.ts` | 4 | Error handler + 404 handler |
| `__tests__/middleware/requestLogger.test.ts` | 2 | Request logging middleware |
| `__tests__/utils/validate.test.ts` | 9 | assertNonEmpty, assertValidStatus, assertMaxLength |

---

## Linting & Formatting

```bash
# Lint
cd base-application/client && npm run lint
cd base-application/server && npm run lint

# Auto-fix lint issues (client only)
cd base-application/client && npm run lint:fix

# Format source files (client)
cd base-application/client && npm run format
```

---

## Building for Production

### Backend

```bash
cd base-application/server
npm run build    # compiles TypeScript to dist/
npm start        # runs compiled dist/index.js
```

### Frontend

```bash
cd base-application/client
npm run build    # compiles to client/dist/
npm run preview  # preview the production build locally
```

---

## Environment Variables

All variables are loaded from `.env` at the project root. Never commit `.env` — use `.env.example` as the template.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Express server port |
| `NODE_ENV` | `development` | Environment (`development` / `production`) |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed CORS origins |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | — | MySQL database name |
| `DB_USER` | — | MySQL username |
| `DB_PASSWORD` | — | MySQL password |

---

## Security

- Express binds to **`127.0.0.1` only** — never `0.0.0.0`
- CORS restricted to origins defined in `CORS_ORIGINS`
- **Helmet.js** applied as first middleware for HTTP security headers
- All secrets loaded from `.env` — never hardcoded
- All GraphQL resolver inputs validated by `validate.ts` before any data access
- Error responses return only `{ error: { message, code } }` — no stack traces or internals
- Structured JSON logging via **Pino** — no sensitive data ever logged
- MySQL credentials accessed exclusively via environment variables
- Database user has minimum required privileges (SELECT, INSERT, UPDATE, DELETE only)

---

## Next Steps

This scaffold is designed to be extended with:

- **Authentication** — SAML / OpenID Connect / OAuth 2.0
- **Database migrations** — Flyway or Liquibase for schema versioning
- **Advanced GraphQL** — Subscriptions, pagination, DataLoader for N+1 prevention
- **State management** — Apollo reactive variables or Zustand
- **CI/CD** — GitHub Actions workflow with lint, test, and security gates

---

*Made with Bob*
