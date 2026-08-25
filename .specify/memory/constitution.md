<!--
SYNC IMPACT REPORT:
- Version change: null (Template) -> 1.0.0 (Initial Ratification)
- List of modified principles:
  - None (Template placeholders instantiated as concrete principles for COPEd)
- Added sections:
  - Technical Constraints and Stack Standards (Restricciones Técnicas y Estándares de Stack)
  - Development Workflow and Quality Gates (Flujo de Desarrollo y Puertas de Calidad)
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Generic "Constitution Check" is fully aligned)
  - ✅ .specify/templates/spec-template.md (Fully aligned)
  - ✅ .specify/templates/tasks-template.md (Fully aligned)
  - ✅ .specify/templates/checklist-template.md (Fully aligned)
- Follow-up TODOs:
  - None (All placeholders successfully resolved)
-->

# COPEd Constitution

## Core Principles

### I. Flujo de Trabajo Secuencial y Estricto (Sequential Workflow)
Los pedidos MUST avanzar de manera estrictamente lineal por los cuatro sectores definidos:
Sector 1 → Sector 2 → Sector 3 → Sector 4 → TERMINADO. No se permite saltar ningún sector ni
retroceder de sector de forma manual. Un pedido solo avanza al siguiente sector cuando el usuario del
sector actual lo marca explícitamente como terminado en el sistema. El Sector 4 es el único
autorizado para cambiar el estado de un pedido a TERMINADO.

### II. Monoprocesamiento por Sector y Gestión de Cola Flexible (Single Active Order & FIFO Queue)
Cada sector MUST trabajar con exactamente un solo pedido activo a la vez. Los demás pedidos asignados al
sector MUST permanecer en una cola de espera. La cola será FIFO (First In, First Out) por defecto, pero
el usuario del sector tiene la flexibilidad de elegir libremente qué pedido pendiente de su cola desea
atender y activar. No existirá ningún estado o flag denominado "espera prioritaria"; la prioridad se
representará únicamente mediante la posición física de los pedidos dentro de la cola.

### III. Control de Cambio Activo y Retorno de Pedidos (Active Order Modification Guard)
Si un usuario del sector decide cambiar de pedido activo antes de haber terminado el actual, el
sistema MUST solicitar una confirmación explícita (dialog/modal de confirmación) para evitar acciones
accidentales. Si el usuario confirma el cambio, el pedido que estaba activo volverá inmediatamente a la
cola de espera de ese sector y MUST colocarse en la primera posición (al principio de la cola), listado
para su inmediata reactivación.

### IV. Integración de Datos y Custodia Unificada del Estado (Data Import & State Integrity)
La importación inicial de pedidos se realizará a través de un archivo Excel externo que contiene
únicamente: `código de pedido`, `cliente`, `producto` y `cantidad`. Dado que este Excel no contiene el
estado, el sistema MUST inicializar los pedidos importados con un estado inicial en la cola del Sector 1.
A partir de ese momento, COPEd asume la custodia y es la única fuente de verdad para el ciclo de vida y
los estados del pedido.

### V. Autenticación Centralizada y Seguridad por Capas (Supabase Auth & RLS)
Todos los usuarios de la aplicación MUST autenticarse mediante Supabase Auth para acceder a cualquier
operación de los sectores. El sistema MUST aplicar políticas de seguridad robustas a nivel de backend
y base de datos utilizando Row Level Security (RLS) en Supabase para asegurar que solo los usuarios
autorizados puedan leer y modificar los datos de los pedidos correspondientes a sus sectores.

## Technical Constraints and Stack Standards
El sistema se construirá utilizando React para el desarrollo del frontend y Supabase como backend-as-a-service
(base de datos, autenticación y tiempo real). Se utilizará TypeScript de forma obligatoria en todo el
código para garantizar la seguridad de tipos. El control de versiones MUST seguir la convención de
Conventional Commits para asegurar la trazabilidad completa del desarrollo.

## Development Workflow and Quality Gates
Todo desarrollo de características en COPEd MUST pasar por el ciclo completo de SpecKit (Spec → Plan → Tasks
→ Implement). Las entregas e integraciones de código MUST superar con éxito todas las pruebas unitarias e
integración, así como el análisis de linters (ESLint/Prettier), antes de ser desplegadas o marcadas como listas.

## Governance
Esta Constitución es el documento supremo que rige el diseño y desarrollo de COPEd. Cualquier enmienda a
estos principios requiere documentación formal, incremento de versión semántica, aprobación del equipo de
ingeniería y un plan de migración de datos si los estados se ven alterados. Las revisiones de código (PRs)
deben validar rigurosamente la adherencia a estos principios.

**Version**: 1.0.0 | **Ratified**: 2026-08-19 | **Last Amended**: 2026-08-19
