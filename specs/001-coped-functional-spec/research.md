# Phase 0: Research - COPEd Order Workflow Control

## Research Tasks & Findings

### 1. Supabase RLS for Sector-Based Access
- **Decision**: Use Row Level Security (RLS) policies on the `orders` table.
- **Rationale**: Ensures security at the database level, preventing cross-sector data leakage.
- **Alternatives Considered**: Application-level filtering (prone to bugs), separate tables per sector (unscalable).

### 2. Queue Management (FIFO + Priority)
- **Decision**: Orders will have `status` and `sector_id` fields. `priority` is not a separate state but derived from a `position` column.
- **Rationale**: Simplifies the state machine and adheres to Constitution Principle II (No "espera prioritaria" state).
- **Alternatives Considered**: `priority` flag (violates constitution), dedicated `queue` tables.

### 3. Excel Import
- **Decision**: Frontend will use a library (e.g., `xlsx`) to parse Excel locally and push JSON to Supabase via an API endpoint.
- **Rationale**: Keeps data processing lightweight and offloads parsing to the client before server-side validation.
- **Alternatives Considered**: Server-side Excel parsing (more resource intensive).

## Summary
- System is well-defined by the constitution and requirements. No critical unknowns identified.
