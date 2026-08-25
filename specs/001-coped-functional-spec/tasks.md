# Tasks: COPEd Order Workflow Control

**Input**: Design documents from `specs/001-coped-functional-spec/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize TypeScript project with React and Supabase dependencies
- [x] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup Supabase database schema and RLS policies
- [x] T005 [P] Implement authentication framework using Supabase Auth
- [x] T006 [P] Setup API routing and client-side Supabase service

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Import and Initialize Orders (Priority: P1) 🎯 MVP

**Goal**: Enable importing orders from Excel and initializing them in Sector 1.

### Implementation for User Story 1

- [x] T007 [US1] Create Order model in backend/src/models/order.ts
- [x] T008 [US1] Implement Excel parsing utility in frontend/src/services/excelImport.ts
- [x] T009 [US1] Implement Import API endpoint in backend/src/api/orders.ts
- [x] T010 [US1] Implement Order Import UI in frontend/src/pages/ImportPage.tsx

**Checkpoint**: At this point, Order Import should be functional.

---

## Phase 4: User Story 2 - Sector Workflow Management (Priority: P1)

**Goal**: Manage order queues per sector and enable order advancement.

### Implementation for User Story 2

- [x] T011 [P] [US2] Create Sector dashboard page in frontend/src/pages/SectorDashboard.tsx
- [x] T012 [P] [US2] Implement Queue service in frontend/src/services/queueService.ts
- [x] T013 [US2] Implement order completion and advancement logic in backend/src/api/orders.ts
- [x] T014 [US2] Implement Sector UI components in frontend/src/components/SectorQueue.tsx

**Checkpoint**: Orders can now advance through sectors.

---

## Phase 5: User Story 3 - Active Order Management (Priority: P2)

**Goal**: Enable switching active orders with confirmation and proper re-queuing.

### Implementation for User Story 3

- [x] T015 [US3] Implement confirmation dialog component in frontend/src/components/ConfirmSwitch.tsx
- [x] T016 [US3] Implement logic for re-queuing interrupted orders at start of queue in backend/src/api/orders.ts
- [x] T017 [US3] Integrate confirmation guard in frontend/src/pages/SectorDashboard.tsx

**Checkpoint**: Order switching with confirmation and re-queuing is fully functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final polish and security hardening

- [x] T018 [P] Documentation updates in docs/
- [x] T019 [P] Final RLS policy audit for security hardening
- [x] T020 Run quickstart.md validation
- [x] T021 [P] Write unit tests for order queue logic and state transitions

---

## Dependencies & Execution Order

- **Setup (Phase 1)** $\rightarrow$ **Foundational (Phase 2)** $\rightarrow$ **User Stories (Phase 3-5)** $\rightarrow$ **Polish (Phase 6)**

---

## Parallel Opportunities

- All Setup and Foundational [P] tasks can be parallelized.
- Frontend component development can be parallelized with backend API development for each story.
