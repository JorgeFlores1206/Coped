# Feature Specification: COPEd Functional Specification

**Feature Branch**: `001-coped-functional-spec`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Crear la especificación funcional del sistema COPEd..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import and Initialize Orders (Priority: P1)

Como gestor de pedidos, quiero importar una lista de pedidos desde un archivo Excel, de forma que se inicien en el flujo de trabajo del Sector 1.

**Why this priority**: Es el punto de entrada de los datos necesarios para operar el sistema.

**Independent Test**: Subir un archivo Excel con datos válidos y verificar que los pedidos aparecen en la cola de espera del Sector 1.

**Acceptance Scenarios**:

1. **Given** un archivo Excel con formato de columnas (Código, Cliente, Producto, Cantidad), **When** el gestor importa el archivo, **Then** los pedidos son creados con estado inicial en Sector 1.

---

### User Story 2 - Sector Processing and Flow (Priority: P1)

Como usuario de sector, quiero gestionar la cola de pedidos de mi sector y procesarlos para que avancen en el flujo establecido (S1 → S2 → S3 → S4 → TERMINADO).

**Why this priority**: Es la funcionalidad principal para la operativa de los sectores.

**Independent Test**: Marcar un pedido activo como terminado en el Sector 1 y verificar que aparece en la cola del Sector 2.

**Acceptance Scenarios**:

1. **Given** un pedido activo en el Sector 1, **When** el usuario lo marca como terminado, **Then** el pedido avanza automáticamente al Sector 2.
2. **Given** un pedido en el Sector 4, **When** el usuario lo marca como terminado, **Then** el pedido pasa a estado TERMINADO y se finaliza su recorrido.

---

### User Story 3 - Active Order Management (Priority: P2)

Como usuario de sector, quiero cambiar el pedido activo que estoy trabajando por otro de la cola de espera, con confirmación de seguridad y reingreso ordenado.

**Why this priority**: Permite flexibilidad operativa manteniendo la trazabilidad.

**Independent Test**: Cambiar un pedido activo por uno de la cola y verificar que el pedido previo vuelve al principio de la cola.

**Acceptance Scenarios**:

1. **Given** un pedido activo y pedidos en espera, **When** el usuario selecciona otro pedido de la cola, **Then** el sistema solicita confirmación.
2. **Given** confirmación del usuario, **When** el cambio se procesa, **Then** el pedido activo previo vuelve a la cola en la primera posición y el pedido seleccionado pasa a ser el activo.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require Supabase Auth for all user access.
- **FR-002**: System MUST allow importing orders (code, client, product, quantity) from Excel, initializing them in Sector 1.
- **FR-003**: System MUST enforce sequential flow: Sector 1 → Sector 2 → Sector 3 → Sector 4 → TERMINADO.
- **FR-004**: System MUST ensure only one order is active per sector.
- **FR-005**: System MUST implement FIFO queue by default, allowing manual selection of the active order from the queue.
- **FR-006**: System MUST require explicit confirmation before switching active orders.
- **FR-007**: System MUST re-queue interrupted orders at the start of the queue.
- **FR-008**: System MUST implement strict sector-based access control.

### Key Entities

- **Order**: Código, Cliente, Producto, Cantidad, Estado/Sector, Usuario activo (opcional).
- **User**: Nombre, Sector asignado, Permisos.
- **Sector**: 1, 2, 3, 4.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of imported orders are correctly queued in Sector 1.
- **SC-002**: Orders strictly follow the defined sector path with no skips.
- **SC-003**: Confirmation dialogs prevent accidental active order switches.
- **SC-004**: Users only view/interact with orders belonging to their assigned sector.

## Assumptions

- Excel format is consistent as per requirements.
- Users are assigned to only one sector at a time.
