# Data Model: COPEd Order Workflow Control

## Entities

### Order
- `id` (uuid, PK)
- `code` (text, unique)
- `client` (text)
- `product` (text)
- `quantity` (integer)
- `sector_id` (integer, FK: Sectors.id)
- `status` (text: 'pending', 'active', 'terminated')
- `position` (integer, for queue ordering)
- `updated_at` (timestamp)

### User
- `id` (uuid, PK, references Supabase Auth)
- `sector_id` (integer, FK: Sectors.id)

### Sector
- `id` (integer, PK)
- `name` (text)

## Relationships
- User belongs to one Sector.
- Order has one current Sector.
- Sector has many Orders.

## State Transitions
- Pending → Active (in same sector)
- Active → Terminated (within Sector 4)
- Active → Forward (to next sector)
- Active → Re-queued (at start of queue)

## Integrity Rules
- Solo puede existir una orden con `status = 'active'` por `sector_id`.
- Las órdenes en estado `terminated` conservan el `sector_id = 4`.
- Las políticas RLS deben garantizar que cada usuario solo pueda ver y modificar órdenes de su `sector_id`.
- El campo `position` debe reiniciarse correctamente al mover una orden entre sectores.
