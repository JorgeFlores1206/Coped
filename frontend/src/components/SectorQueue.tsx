import type { Order } from '../services/ordersService';

type Props = { orders: Order[]; hasActiveOrder: boolean; onActivate: (orderId: string) => void; busy?: boolean };

export function SectorQueue({ orders, hasActiveOrder, onActivate, busy = false }: Props) {
  if (orders.length === 0) return <p>No hay pedidos pendientes en la cola.</p>;
  return <ul className="queue">{orders.map((order, index) => <li key={order.id} className="queue-item"><div className="queue-position">{String(index + 1).padStart(2, '0')}</div><div className="queue-details"><strong>{order.code}</strong><span>{order.client}</span><span>{order.product} · {order.quantity} unidades</span></div><button disabled={busy} onClick={() => onActivate(order.id)}>{hasActiveOrder ? 'Cambiar' : 'Activar'}</button></li>)}</ul>;
}
