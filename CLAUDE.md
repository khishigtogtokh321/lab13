# CLAUDE.md

## Project

Mini Library Management System for F.CSM311 Lab 13.

## Stack

- React + Tailwind CSS frontend
- Node.js Express REST API
- PostgreSQL database
- Node.js built-in test runner

## Commands

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm test
npm run build
```

## Conventions

- Use Conventional Commits: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
- Keep Part A as planning only; do not place production code there.
- Keep reusable business rules in `partB/shared/`.
- Validate request bodies before database writes.
- Keep database access behind repository functions.
- Prefer small React components and derived state over duplicated state.
- Write tests for loan availability, overdue status, validation, and search behavior.

## No-Go Zones

- Do not commit `.env` or database credentials.
- Do not use raw SQL string concatenation with user input.
- Do not delete assignment documents after implementation.
- Do not claim AI-generated work as fully manual work.
- Do not skip AI session logs.

## AI Workflow

Use the flow: spec -> generate -> review -> integrate. AI output must be checked for hallucinated package APIs, security issues, and assignment compliance.
