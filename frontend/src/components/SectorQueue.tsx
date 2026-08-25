import type { Order } from '../services/ordersService';

type Props = { orders: Order[]; hasActiveOrder: boolean; onActivate: (orderId: string) => void; busy?: boolean };

export function SectorQueue({ orders, hasActiveOrder, onActivate, busy = false }: Props) {
  if (orders.length === 0) return <p>No hay pedidos pendientes en la cola.</p>;
  return <ul className="queue">{orders.map((order) => <li key={order.id}><span><strong>{order.code}</strong> · {order.client} · {order.product} ({order.quantity})</span><button disabled={busy} onClick={() => onActivate(order.id)}>{hasActiveOrder ? 'Cambiar a este pedido' : 'Activar'}</button></li>)}</ul>;
}
