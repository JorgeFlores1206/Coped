# API Contract: Order Management

## Endpoints

### POST /api/orders/import
- **Description**: Import multiple orders from JSON.
- **Input**: `Array<{code, client, product, quantity}>`
- **Output**: `{status: 'success', count: number}`

### PATCH /api/orders/:id/status
- **Description**: Update order status, transition sector, or manage queue.
- **Input**: `{action: 'activate' | 'finish' | 'interrupt'}`
- **Output**: `Order` entity

## RLS Policies
- `orders` table: `SELECT`, `UPDATE` allowed only if `user.sector_id == order.sector_id`.
