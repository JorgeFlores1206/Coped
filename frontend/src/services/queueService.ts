import { supabase } from './supabaseClient';

export const getQueue = async (sectorId: number) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('sector_id', sectorId)
    .order('position', { ascending: true });
  if (error) throw error;
  return data;
};
