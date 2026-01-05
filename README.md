# Angular + NestJS User Management

A monorepo demonstrating user management with Angular frontend, NestJS backend, Better Auth authentication, and PostgreSQL database.

## Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- [Hurl](https://hurl.dev/) (optional, for API integration tests)

## Setup

### 1. Start PostgreSQL

Make sure Docker is running, then start the database:

```bash
bun run db:up
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Copy the example environment file in the API package:

```bash
cp packages/api/.env.example packages/api/.env
```

Edit `packages/api/.env` with your configuration (the defaults work for local development).

### 4. Initialize the database

Run migrations and seed the database with test users:

```bash
bun -C packages/api db:reset
bun -C packages/api db:seed
```

### 5. Start development servers

Run both the API and UI in development mode:

```bash
bun run dev
```

Or run them separately:

```bash
# Terminal 1 - API (runs on http://localhost:3000)
bun -C packages/api dev

# Terminal 2 - UI (runs on http://localhost:4200)
bun -C packages/ui dev
```

## Seeded Users

After running the seed command, you can log in with:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | ADMIN |
| user@example.com | password123 | USER |

## Available Scripts

### Root

| Script | Description |
|--------|-------------|
| `bun run dev` | Start both API and UI in dev mode |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Fix linting issues |
| `bun run typecheck` | Type check all packages |
| `bun run db:up` | Start PostgreSQL container |
| `bun run db:down` | Stop PostgreSQL container |
| `bun run db:reset` | Reset PostgreSQL (destroys data) |

### API (`packages/api`)

| Script | Description |
|--------|-------------|
| `bun run dev` | Start NestJS in watch mode |
| `bun run build` | Build for production |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:seed` | Seed the database |
| `bun run db:reset` | Reset and re-run migrations |
| `bun run db:studio` | Open Prisma Studio |
| `bun run hurl` | Run Hurl integration tests |

### UI (`packages/ui`)

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Angular dev server |
| `bun run build` | Build for production |

## Running Tests

### API Integration Tests (Hurl)

The API has integration tests written in [Hurl](https://hurl.dev/). Install Hurl first:

```bash
# macOS
brew install hurl

# Or see https://hurl.dev/docs/installation.html for other platforms
```

Then run the tests (with the API server running):

```bash
bun -C packages/api hurl
```

## Project Structure

```
angular-user-mgmt/
├── packages/
│   ├── api/          # NestJS backend
│   │   ├── prisma/   # Database schema and migrations
│   │   ├── src/      # Source code
│   │   └── tests/    # Hurl integration tests
│   └── ui/           # Angular frontend
│       └── src/      # Source code
├── docker-compose.yml
└── biome.json
```

## Tech Stack

- **Frontend**: Angular 20, PrimeNG, NgRx
- **Backend**: NestJS, GraphQL Yoga, Prisma
- **Auth**: Better Auth (email/password, sessions)
- **Database**: PostgreSQL
- **Email**: Resend + React Email
