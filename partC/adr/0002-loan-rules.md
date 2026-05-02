# ADR-002: Keep Loan Rules In Shared Domain Functions

## Status

Accepted

## Context

The library system needs rules for loan eligibility, available copies, return behavior, overdue status, filtering, and dashboard counts. These rules could be placed directly inside Express routes or React components, but that would make them harder to test and explain.

## Decision

Keep core business rules in `partB/shared/libraryRules.js`. Express routes call these functions, and unit tests import them directly.

## Consequences

Positive:

- Unit tests do not need a running database or web server.
- The most important logic is easy to explain during assessment.
- Frontend, backend, and tests can share the same rule definitions when needed.

Negative:

- The shared module must remain framework-independent.
- Future database-level constraints must stay consistent with these rules.
