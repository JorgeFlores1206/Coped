# Feature Specification: COPEd Order Workflow Control

**Feature Branch**: `001-order-workflow-control`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Crear la especificación funcional del sistema COPEd (Control de Pedidos)... [long prompt content]"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import and Initialize Orders (Priority: P1)

Como gestor de pedidos, quiero importar órdenes desde un archivo externo para iniciar el flujo de trabajo en el sistema.

**Why this priority**: Es el paso inicial necesario para tener datos que procesar.

**Independent Test**: Importar un Excel con pedidos y verificar que aparecen en la cola de espera del Sector 1.

**Acceptance Scenarios**:

1. **Given** un archivo Excel con formato requerido, **When** el usuario importa el archivo, **Then** los pedidos se crean en el sistema con estado inicial en Sector 1.

---

### User Story 2 - Sector Workflow Management (Priority: P1)

Como usuario de sector, quiero gestionar mi cola de pedidos y procesarlos para que avancen en el flujo establecido.

**Why this priority**: Es la funcionalidad principal del sistema de control de pedidos.

**Independent Test**: Marcar un pedido como terminado y verificar que avanza al siguiente sector inmediatamente.

**Acceptance Scenarios**:

1. **Given** un pedido en Sector 1, **When** el usuario lo marca como terminado, **Then** el pedido pasa al Sector 2.
2. **Given** un pedido en Sector 4, **When** el usuario lo marca como terminado, **Then** el pedido pasa a estado TERMINADO.

---

### User Story 3 - Active Order Management and Queue (Priority: P2)

Como usuario de sector, quiero cambiar de pedido activo de forma controlada y seleccionar pedidos de la cola de espera.

**Why this priority**: Permite la flexibilidad operativa solicitada.

**Independent Test**: Intentar cambiar un pedido activo y verificar que el sistema solicita confirmación y reubica el pedido interrumpido.

**Acceptance Scenarios**:

1. **Given** un pedido activo en el Sector 1 y varios en cola, **When** el usuario selecciona otro pedido, **Then** el sistema solicita confirmación.
2. **Given** confirmación de cambio, **When** el usuario acepta, **Then** el pedido activo previo vuelve al inicio de la cola del Sector 1 y el nuevo pedido se activa.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to authenticate using standard secure authentication.
- **FR-002**: System MUST import order data (code, client, product, quantity) from external files.
- **FR-003**: System MUST enforce a strict sequential workflow: Sector 1 → Sector 2 → Sector 3 → Sector 4 → TERMINADO.
- **FR-004**: System MUST ensure only one order is active per sector.
- **FR-005**: System MUST maintain a FIFO queue per sector by default.
- **FR-006**: System MUST allow users to manually select any order from the queue to become active.
- **FR-007**: System MUST require explicit confirmation before switching active orders.
- **FR-008**: System MUST return interrupted active orders to the start of the queue.
- **FR-009**: System MUST restrict order advancement: only the current sector user can advance an order.
- **FR-010**: System MUST control user access based on their assigned sector.

### Key Entities

- **Order**: Contains code, client, product, quantity, and current status/sector.
- **User**: Authenticated entity with assigned role/sector permissions.
- **Queue**: Ordered list of pending orders for a specific sector.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of imported orders are correctly initialized in the Sector 1 queue.
- **SC-002**: No order can bypass any sector in the sequential workflow.
- **SC-003**: Active order switches are always protected by a confirmation step.
- **SC-004**: Interrupted orders are correctly re-queued at the first position in under 1 second.
- **SC-005**: Users can only access and perform actions on orders within their authorized sector.

## Assumptions

- User-uploaded files strictly follow the defined Excel format.
- All users belong to at least one sector.
- Order codes are unique across the system.
