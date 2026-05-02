# Part B Implementation

## Features

- Book inventory list, search, and category filter
- Member data model and API endpoints
- Loan creation and return workflow
- Overdue loan status tracking
- Dashboard summary metrics

## Structure

- `frontend/` - React + Tailwind UI
- `backend/` - Express API and PostgreSQL schema
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
```

## Environment

Create `.env` locally for the backend:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mini_library
PORT=4000
```
