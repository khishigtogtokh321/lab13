# Part B Implementation

## Features

- Book inventory list, search, and category filter
- Member data model and API endpoints
- Loan creation and return workflow
- Overdue loan status tracking
- Dashboard summary metrics
- Admin authentication API with JWT stored in an httpOnly cookie
- Prisma ORM schema and Prisma Studio database UI

## Structure

- `frontend/` - React + Tailwind UI
- `backend/` - Express API and PostgreSQL schema
- `../prisma/schema.prisma` - Prisma database model used by the backend
- `shared/` - testable domain logic
- `tests/` - Node.js unit tests
- `openapi.yaml` - REST API specification
- `ai-sessions/` - summarized AI build sessions

## Commands

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm test
npm run test:api-smoke
npx prisma studio
```

## Environment

Create `.env` locally for the backend:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mini_library
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin12345
PORT=4000
```

Authentication endpoints:

- `POST /api/auth/login` with `{ "email": "admin@example.com", "password": "admin12345" }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

On first successful development login using `ADMIN_EMAIL` and `ADMIN_PASSWORD`, the backend creates the admin row with a bcrypt password hash.

API smoke check:

```bash
npm run test:api-smoke
```

Run it while the backend is available. It checks health, auth login/me/logout, book/member creation, loan creation, loan extension, loan return, loan list, and dashboard summary.
