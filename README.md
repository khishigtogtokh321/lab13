# Mini Library Management System

An AI-assisted software construction project for F.CSM311 Lab 13.

The project is organized into three required assignment parts:

- `partA/` - planning documents, architecture, stack decision, ADR, AI planning log
- `partB/` - implementation, tests, OpenAPI spec, AI build logs
- `partC/` - reflection, AI usage report, second ADR, self-evaluation

## Selected Topic

Mini library management system with book inventory, member management, loan/return workflow, overdue tracking, and search/filter dashboard.

## Selected Stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express REST API
- Database: PostgreSQL + Prisma ORM
- Testing: Node.js built-in test runner for domain logic

## Commands

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm test
npm run test:api-smoke
npm run build
```

## Environment

Create a local `.env` file from `.env.example` before running the backend or Prisma commands.

Required production variables:

- `DATABASE_URL` - PostgreSQL connection string used by Prisma.
- `JWT_SECRET` - long random secret reserved for signed admin/auth tokens.
- `ADMIN_EMAIL` - initial administrator email address.
- `ADMIN_PASSWORD` - initial administrator password; use a strong secret outside development.
- `PORT` - backend API port, usually `4000`.

In development, the backend defaults to `PORT=4000`, but production startup validates all required variables.

## Production Run

This baseline runs the Express API and builds the React frontend as static assets. The generated frontend files are written to `dist/frontend` and should be served by a static host or reverse proxy.

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
NODE_ENV=production node partB/backend/src/server.js
```

For Windows PowerShell:

```powershell
$env:NODE_ENV="production"
node partB/backend/src/server.js
```

## Docker

Run the full local stack with Docker Compose:

```bash
docker compose up --build
```

This creates:

- `mini-library` - Node.js app container with React, Vite, Express, and project dependencies
- `mini-library-postgres` - PostgreSQL container managed by Prisma schema sync

Local URLs:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`
- PostgreSQL from host: `localhost:5433`
- Prisma Studio: `http://localhost:5555`

The app container uses this internal database URL:

```bash
postgres://postgres:postgres@db:5432/mini_library
```

To stop the stack:

```bash
docker compose down
```

To reset the PostgreSQL data volume and rerun schema initialization:

```bash
docker compose down -v
docker compose up --build
```

If Vite/Rollup native dependency errors appear after changing Node packages, rebuild the app image without Docker cache:

```bash
docker compose build --no-cache app
docker compose up
```

## Prisma

Prisma is configured in `prisma/schema.prisma` and uses the same PostgreSQL database.

For local host commands, create `.env` with:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5433/mini_library
```

In development, sync the schema directly and open the database UI:

```bash
npx prisma db push
npx prisma studio
```

Run the API smoke check after the backend is running:

```bash
npm run test:api-smoke
```

It uses `API_BASE_URL` when set, otherwise `http://localhost:4000`, and logs in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Use `prisma db push` only for local development databases where schema reset is acceptable.

For production, use a migration-style flow:

```bash
npx prisma migrate dev --name describe_schema_change
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add production database constraints"
npx prisma migrate deploy
```

Production deployments should run `npx prisma migrate deploy`, not `npx prisma db push`. Review generated migration SQL before committing it, back up production data before applying database changes, and keep `DATABASE_URL` pointed at the intended production database only during deployment.

If you want Prisma Studio from inside Docker:

```bash
npm run docker:studio
```

## AI Use Disclosure

AI assistance was used for planning, architecture writing, code generation, test drafting, and reflection drafting. All generated output should be reviewed before submission.
