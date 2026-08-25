import type { ExcelOrder } from './excelImport';
import { createAuthenticatedSupabaseClient, supabase } from './supabaseClient';

export type OrderStatus = 'pending' | 'active' | 'terminated';
export type Order = { id: string; code: string; client: string; product: string; quantity: number; sector_id: number; status: OrderStatus; position: number; updated_at: string };

const now = () => new Date().toISOString();

export const importOrders = async (orders: ExcelOrder[], accessToken: string) => {
  const rows = orders.map(({ code, client, product, quantity }) => ({ code, client, product, quantity, sector_id: 1, status: 'pending', position: 0 }));
  const client = createAuthenticatedSupabaseClient(accessToken);
  const { error } = await client.from('orders').insert(rows);
  if (error) throw new Error(`No se pudieron importar los pedidos: ${error.message}`);
  return rows.length;
};

export async function getUserSector(userId: string): Promise<number> {
  const { data, error } = await supabase.from('profiles').select('sector_id').eq('id', userId).maybeSingle();
  if (error) throw new Error(`No se pudo obtener el sector del usuario: ${error.message}`);
  if (!data?.sector_id) throw new Error('Tu usuario no tiene un perfil con un sector asignado.');
  return data.sector_id;
}

export async function getSectorOrders(sectorId: number): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('id, code, client, product, quantity, sector_id, status, position, updated_at').eq('sector_id', sectorId).in('status', ['pending', 'active']).order('position', { ascending: true }).order('updated_at', { ascending: true });
  if (error) throw new Error(`No se pudo cargar la cola: ${error.message}`);
  return (data ?? []) as Order[];
}

export async function activateOrder(orderId: string, sectorId: number) {
  const { error } = await supabase.from('orders').update({ status: 'active', position: 0, updated_at: now() }).eq('id', orderId).eq('sector_id', sectorId).eq('status', 'pending');
  if (error) throw new Error(`No se pudo activar el pedido: ${error.message}`);
}

export async function finishOrder(orderId: string, currentSectorId: number) {
  const nextValues = currentSectorId < 4
    ? { sector_id: currentSectorId + 1, status: 'pending' as const, position: 0, updated_at: now() }
    : { sector_id: 4, status: 'terminated' as const, position: 0, updated_at: now() };
  const { error, count } = await supabase.from('orders').update(nextValues, { count: 'exact' }).eq('id', orderId).eq('sector_id', currentSectorId).eq('status', 'active');
  if (error) throw new Error(`No se pudo terminar el pedido: ${error.message}`);
  if (count !== 1) throw new Error('El pedido no pudo avanzar. Verifica la política RLS de actualización del sector.');
}

export async function switchOrder(currentOrderId: string, newOrderId: string, sectorId: number) {
  const { error: deactivateError } = await supabase.from('orders').update({ status: 'pending', position: 0, updated_at: now() }).eq('id', currentOrderId).eq('sector_id', sectorId).eq('status', 'active');
  if (deactivateError) throw new Error(`No se pudo reingresar el pedido activo: ${deactivateError.message}`);
  const { error: activateError } = await supabase.from('orders').update({ status: 'active', position: 0, updated_at: now() }).eq('id', newOrderId).eq('sector_id', sectorId).eq('status', 'pending');
  if (!activateError) return;
  await supabase.from('orders').update({ status: 'active', position: 0, updated_at: now() }).eq('id', currentOrderId).eq('sector_id', sectorId).eq('status', 'pending');
  throw new Error(`No se pudo activar el pedido seleccionado: ${activateError.message}`);
}
