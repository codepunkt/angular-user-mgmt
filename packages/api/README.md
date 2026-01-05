# API Package

NestJS backend for the Angular User Management application.

## Setup

```bash
# Install dependencies
bun install

# Start PostgreSQL (from repo root)
bun db:up

# Run migrations
bun db:migrate

# Seed the database
bun db:seed

# Start development server
bun dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with hot reload |
| `bun build` | Build for production |
| `bun start` | Run production build |
| `bun test` | Run Vitest unit/integration tests |
| `bun hurl` | Run Hurl HTTP integration tests |
| `bun typecheck` | Type check without emitting |
| `bun db:migrate` | Run Prisma migrations |
| `bun db:seed` | Seed the database |
| `bun db:studio` | Open Prisma Studio |

## Hurl Tests

This package includes HTTP integration tests written with [Hurl](https://hurl.dev).

### Installing Hurl

**macOS (Homebrew):**
```bash
brew install hurl
```

**Other platforms:**
See the [Hurl installation guide](https://hurl.dev/docs/installation.html).

### Running Hurl Tests

Make sure the API server is running first:

```bash
# Terminal 1: Start the API
bun dev

# Terminal 2: Run Hurl tests
bun hurl
```

### Test Files

- `tests/auth-admin.hurl` - Admin user authentication flow
- `tests/auth-user.hurl` - Regular user authentication flow

## Seeded Users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin123! | ADMIN |
| user@example.com | User123! | USER |
