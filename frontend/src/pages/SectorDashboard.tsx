import { useCallback, useEffect, useState } from 'react';
import { ConfirmSwitch } from '../components/ConfirmSwitch';
import { SectorQueue } from '../components/SectorQueue';
import { activateOrder, finishOrder, getSectorOrders, switchOrder, type Order } from '../services/ordersService';

export function SectorDashboard({ sectorId }: { sectorId: number }) {
  const [orders, setOrders] = useState<Order[]>([]); const [pendingOrderId, setPendingOrderId] = useState<string | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setOrders(await getSectorOrders(sectorId)); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo cargar el sector.'); } finally { setLoading(false); } }, [sectorId]);
  useEffect(() => { void load(); }, [load]);
  const activeOrder = orders.find((order) => order.status === 'active'); const pendingOrders = orders.filter((order) => order.status === 'pending');
  async function run(action: () => Promise<void>, successMessage = '') { setBusy(true); setError(''); setMessage(''); try { await action(); await load(); setMessage(successMessage); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo completar la operación.'); } finally { setBusy(false); } }
  function selectOrder(orderId: string) { if (activeOrder) setPendingOrderId(orderId); else void run(() => activateOrder(orderId, sectorId)); }
  function confirmSwitch() { if (!activeOrder || !pendingOrderId) return; void run(async () => { await switchOrder(activeOrder.id, pendingOrderId, sectorId); setPendingOrderId(null); }); }
  return <section className="card"><h2>Sector {sectorId}</h2>{error && <p role="alert" className="error">{error}</p>}{message && <p role="status">{message}</p>}{loading ? <p>Cargando pedidos...</p> : <><section className="active-order"><h3>Pedido activo</h3>{activeOrder ? <div><p><strong>{activeOrder.code}</strong> · {activeOrder.client} · {activeOrder.product} ({activeOrder.quantity})</p><button disabled={busy} onClick={() => void run(() => finishOrder(activeOrder.id, sectorId), sectorId === 4 ? 'Pedido terminado correctamente.' : `Pedido enviado al sector ${sectorId + 1}.`)}>{sectorId === 4 ? 'Terminar pedido' : 'Terminar y enviar al sector ' + (sectorId + 1)}</button></div> : <p>No hay un pedido activo.</p>}</section><h3>Cola de pedidos pendientes</h3><SectorQueue orders={pendingOrders} hasActiveOrder={Boolean(activeOrder)} onActivate={selectOrder} busy={busy} /></>}{pendingOrderId && <ConfirmSwitch busy={busy} onConfirm={confirmSwitch} onCancel={() => setPendingOrderId(null)} />}</section>;
}
