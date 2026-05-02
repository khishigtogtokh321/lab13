# ADR-001: Stack Decision

## Status

Accepted

## Context

The assignment requires a small project built with AI-assisted planning, implementation, testing, and reflection. The selected mini library topic needs a user interface, a REST API, relational data, and enough business rules to test.

## Decision

Use React with Tailwind CSS for the frontend, Node.js Express for the REST API, and PostgreSQL for the database.

## Alternatives Considered

- React + NestJS + PostgreSQL: better structure for enterprise apps but more boilerplate.
- React + Django REST Framework + PostgreSQL: mature backend but adds a second language and more setup.

## Consequences

Positive:

- Unified JavaScript ecosystem
- Faster implementation
- Easy REST API documentation with OpenAPI
- PostgreSQL schema maps naturally to books, members, and loans

Negative:

- Express structure must be enforced by convention
- Validation, error handling, and security checks require deliberate implementation
