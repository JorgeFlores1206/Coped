# Quickstart: COPEd Order Workflow Control

## Prerequisites
- Supabase project configured with `orders`, `users`, `sectors` tables.
- RLS policies applied.

## Setup
1. Configure `supabase` client with project URL/Key.
2. Authenticate user.

## Validation Scenarios

### 1. Import Orders
1. Call `POST /api/orders/import` with sample JSON order list.
2. Verify orders appear in Sector 1 queue.

### 2. Process Order
1. Authenticate as Sector 1 User.
2. Select an order from the queue.
3. Mark as active.
4. Mark as finished.
5. Verify order now exists in Sector 2 queue.

### 3. Priority Switch
1. Authenticate as Sector 1 User.
2. Have one active order and at least two in queue.
3. Select the second order in the queue.
4. Confirm switch in dialog.
5. Verify active order returns to top of queue, selected order becomes active.
