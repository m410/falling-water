# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StreamhydroEnergy is a hydroelectric monitoring system built as an Nx monorepo with an Angular 21 frontend and Express 5 backend. The application tracks water flow, temperature, pressure, and other metrics for a micro-hydro power generation system.

## Development Commands

### Starting the Development Environment

```bash
# Start backend API server (port 3000)
npm run api

# Start frontend dev server with proxy (port 4200)
npm start

# Build frontend for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run frontend unit tests (Vitest)
npm test

# Run frontend unit tests (via Nx)
nx test frontend

# Run API E2E tests
nx test api-e2e

# Run frontend E2E tests (Playwright)
nx e2e frontend-e2e

# Run tests for affected projects only
nx affected:test
```

### Linting

```bash
# Lint frontend
npm run lint

# Lint specific project
nx lint api
nx lint frontend
```

### Database Migrations

```bash
# Run migrations
npm run knex migrate:latest

# Create new migration
npm run knex migrate:make migration_name

# Rollback last migration
npm run knex migrate:rollback

# Check migration status
npm run knex migrate:status
```

### Debugging

VSCode launch configurations are available for debugging the API server on port 9230.

## Architecture

### Monorepo Structure

This is an Nx monorepo with the following applications:

- `apps/api` - Express 5 REST API backend
- `apps/frontend` - Angular 21 frontend (zoneless, standalone components)
- `apps/api-e2e` - API E2E tests (Jest + axios)
- `apps/frontend-e2e` - Frontend E2E tests (Playwright)

### Frontend-Backend Communication

**Development Setup:**

- Frontend runs on `http://localhost:4200`
- Backend runs on `http://localhost:3000`
- Frontend proxies all `/api/*` requests to backend via `apps/frontend/proxy.config.json`
- No CORS configuration needed in development

**Authentication Flow:**

- JWT-based authentication with 1-hour token expiration
- Tokens stored in localStorage via `AuthService`
- `authInterceptor` automatically attaches tokens to HTTP requests (except login/register)
- 401 responses trigger automatic logout and redirect to login page

### Backend Architecture (Express)

**Layered Architecture:**

```
Routes → Endpoints (Controllers) → Services → Database
```

1. **Routes** (`*.routes.ts`): Define Express Router with URL paths, HTTP methods, and middleware
2. **Endpoints** (`*.endpoints.ts`): Controller classes that handle requests, extract data, call services, format responses
3. **Services** (`*.repository.ts`): Business logic and database access
4. **Database**: PostgreSQL with connection pool managed in `apps/api/src/db/db.ts`

**Dependency Injection:**

- `ServiceContainer` interface defines all injectable services
- `createContainer()` factory in `apps/api/src/service.container.ts` wires dependencies
- Services injected into Endpoints constructors
- Container stored in `app.locals.container`

**Authentication & Authorization:**

- `authenticateToken` middleware verifies JWT tokens from `Authorization: Bearer <token>` header
- `authorizeRoles(...roles)` middleware checks user roles
- Middleware extends Express Request with `user` property containing decoded JWT payload
- Password hashing uses bcrypt with 10 salt rounds

**Error Handling:**

- Endpoints pass errors to Express error handler via `next(error)`
- Consistent error response format: `{ error: "message" }`

### Frontend Architecture (Angular 21)

**Modern Angular Patterns:**

- Zoneless change detection (no NgZone)
- Standalone components (no NgModules)
- Lazy-loaded routes using `loadComponent()` pattern
- App-level providers in `apps/frontend/src/app/app.config.ts`

**HTTP Communication:**

- Services use Angular's `HttpClient` with RxJS observables
- `authInterceptor` provides centralized token management and error handling
- API services defined in `apps/frontend/src/app/services/`

### Database

**PostgreSQL Setup:**

- Database: `falling_water`
- User: `fallingwater`
- Connection configured in `knexfile.js`

**Migration Strategy:**

- Knex.js manages migrations in `/migrations` directory
- Migration tracking table: `knex_migrations`
- Separate configs for development, staging, production

**Database Access Pattern:**

- Direct SQL queries using `pg` (node-postgres) library
- Connection pool: max 20 connections, 30s idle timeout, 2s connection timeout
- Helper functions in `apps/api/src/db/db.ts`:
  - `query()` - Parameterized queries (SQL injection protection)
  - `getClient()` - For transactions
- Query logging includes execution time and row counts
- No ORM - direct SQL for transparency and control

### Testing Strategy

**Frontend (Vitest):**

- Component tests co-located with components (`.spec.ts` files)
- Configuration: `apps/frontend/vite.config.mts`
- Test environment: jsdom
- Uses Angular TestBed for component testing
- Coverage reports to `coverage/apps/frontend`

**Backend E2E (Jest):**

- Tests in `apps/api-e2e/src/api/api.spec.ts`
- Uses axios for HTTP requests
- Tests actual endpoints with full request/response cycle

**Frontend E2E (Playwright):**

- Browser automation for end-to-end testing
- Configuration: `apps/frontend-e2e/playwright.config.ts`

**Test Execution:**

- Nx caches test results for faster re-runs
- `nx affected:test` only tests changed projects

## Key Files for Context

**Backend Entry Points:**

- `apps/api/src/main.ts` - Server bootstrap and Express app setup
- `apps/api/src/service.container.ts` - Dependency injection setup
- `apps/api/src/auth/auth.ts` - Authentication middleware
- `apps/api/src/db/db.ts` - Database connection pool

**Frontend Entry Points:**

- `apps/frontend/src/main.ts` - Angular bootstrap
- `apps/frontend/src/app/app.config.ts` - App-level providers
- `apps/frontend/src/app/app.routes.ts` - Route definitions

**Configuration:**

- `nx.json` - Nx workspace configuration
- `knexfile.js` - Database migration configuration
- `apps/frontend/proxy.config.json` - API proxy setup
- `apps/api/webpack.config.js` - Backend build configuration
- `apps/frontend/vite.config.mts` - Frontend build and test configuration

## REST API Conventions

- Resource-based URLs: `/api/users`, `/api/users/:id`
- Standard HTTP methods: GET (list/get), POST (create), PUT (update), DELETE (remove)
- JSON request/response format
- Error responses: `{ error: "message" }` with appropriate HTTP status codes

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
