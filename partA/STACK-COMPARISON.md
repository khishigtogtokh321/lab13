# Stack Comparison

## Option 1: React + Express + PostgreSQL

Strengths:

- One JavaScript ecosystem across frontend and backend
- Fast to implement REST endpoints
- PostgreSQL gives realistic relational modeling for books, members, and loans
- Easy to test domain logic with Node.js test runner

Weaknesses:

- Express requires discipline for project structure
- Validation and error handling must be designed manually

## Option 2: React + NestJS + PostgreSQL

Strengths:

- Strong modular architecture
- Built-in patterns for controllers, services, dependency injection
- Looks professional for larger backend systems

Weaknesses:

- More boilerplate than needed for a small assignment
- Decorator-heavy structure may slow early implementation

## Option 3: React + Django REST Framework + PostgreSQL

Strengths:

- Mature backend framework
- Django admin can help inspect data
- Strong ORM and authentication support

Weaknesses:

- Two-language stack adds complexity
- Frontend and backend tooling are less unified

## Decision

The selected stack is **React + Tailwind CSS + Express REST API + PostgreSQL**.

This stack is advanced enough to demonstrate real full-stack architecture, but still small enough to finish within the assignment timeline. It supports a modern UI, REST API, relational data model, and focused unit tests.
