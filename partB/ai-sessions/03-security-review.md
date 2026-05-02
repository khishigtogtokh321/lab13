# AI Session 03: Security Review

## Goal

Check common security and reliability issues before finalizing Part B.

## AI Output

The AI highlighted SQL injection, missing validation, secret leakage, and unhandled errors.

## Human Review

The backend uses parameterized queries, `.env` is ignored, request validation is added, and API errors return structured JSON.
