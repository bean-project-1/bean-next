# Architecture Decision Records

This folder contains key architecture decisions for the BEAN platform.

## Index

| ID  | Title                     | Status   |
|-----|---------------------------|----------|
| 001 | Monorepo with Turborepo   | Accepted |
| 002 | Prisma JSON Pillars       | Accepted |
| 003 | AI Engine Node-first       | Under Review |

---

## ADR-001: Monorepo with Turborepo

**Decision**: Use Turborepo to manage the monorepo.

**Rationale**: Shared packages (types, ui) can be consumed by `apps/web` and future
services without publishing to npm. Turborepo provides incremental builds and caching.

---

## ADR-002: Prisma JSON Pillars

**Decision**: Store Identity, Capital, and Wellbeing pillars as JSON columns in Prisma.

**Rationale**: The pillar schema is evolving rapidly. JSON columns let us iterate on the
data model without migrations. Once stable, we can promote fields to typed columns.

---

## ADR-003: AI Engine in Node.js first

**Decision**: Start AI analysis in the Next.js API routes (calling OpenAI directly).
Migrate to Python FastAPI when volume requires heavier model inference.

**Rationale**: Reduces operational complexity for v1. The `docker-compose.yml` already
has a placeholder for the Python service.
