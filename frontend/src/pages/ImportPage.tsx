import { useState, type ChangeEvent } from 'react';
import { parseExcel } from '../services/excelImport';
import { importOrders } from '../services/ordersService';
import { supabase } from '../services/supabaseClient';

export const ImportPage = () => {
  const [message, setMessage] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true); setMessage('');
    try {
      // RLS permits imports only for the authenticated role. Validate the
      // persisted Supabase session before attempting the direct insert.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        throw new Error('Tu sesión no está activa. Cierra sesión, vuelve a iniciar sesión y luego importa el archivo.');
      }
      const orders = await parseExcel(file);
      const insertedCount = await importOrders(orders, session.access_token);
      setMessage(`${insertedCount} órdenes importadas correctamente.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo importar el archivo.');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return <section className="card"><h2>Importar órdenes</h2><input type="file" accept=".xlsx,.xls" onChange={handleFileChange} disabled={isImporting} />{message && <p role="status">{message}</p>}</section>;
};
