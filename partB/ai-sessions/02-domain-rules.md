# AI Session 02: Domain Rules

## Goal

Design business rules that can be tested without a database.

## AI Output

The AI proposed separate functions for validation, loan eligibility, loan creation, return flow, overdue status, filtering, and dashboard summaries.

## Human Review

The rules were kept in `partB/shared/` so tests do not depend on Express, React, or PostgreSQL.
