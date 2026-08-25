import * as XLSX from 'xlsx';

export type ExcelOrder = { code: string; client: string; product: string; quantity: number };

const normalizeHeader = (value: unknown) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[\s_-]+/g, '')
  .trim()
  .toLowerCase();

const requiredHeaders = ['codped', 'codcliente', 'producto', 'cantidad'] as const;
type SheetMatch = { sheetName: string; rows: unknown[][]; headerRowIndex: number };

function findOrderTable(workbook: XLSX.WorkBook): SheetMatch | undefined {
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', blankrows: false });
    const headerRowIndex = rows.findIndex((row) => {
      const headers = new Set(row.map(normalizeHeader));
      return requiredHeaders.every((header) => headers.has(header));
    });
    if (headerRowIndex !== -1) return { sheetName, rows, headerRowIndex };
  }
  return undefined;
}

export const parseExcel = async (file: File): Promise<ExcelOrder[]> => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  if (workbook.SheetNames.length === 0) throw new Error('El archivo no contiene una hoja para importar.');

  const match = findOrderTable(workbook);
  if (!match) {
    const sheets = workbook.SheetNames.join(', ');
    throw new Error(`No encontré la tabla de pedidos en ninguna hoja (${sheets}). En una tabla dinámica, expande los campos para que se vean Cod_Ped, Cod_cliente, Producto y Cantidad; luego vuelve a guardar el archivo.`);
  }

  const headerRow = match.rows[match.headerRowIndex];
  const columnIndex = Object.fromEntries(headerRow.map((header, index) => [normalizeHeader(header), index]));
  const dataRows = match.rows.slice(match.headerRowIndex + 1).filter((row) => row.some((cell) => String(cell).trim() !== ''));
  if (dataRows.length === 0) throw new Error(`No hay pedidos debajo de los encabezados en la hoja ${match.sheetName}.`);

  return dataRows.map((row, index) => {
    const code = String(row[columnIndex.codped] ?? '').trim();
    const client = String(row[columnIndex.codcliente] ?? '').trim();
    const product = String(row[columnIndex.producto] ?? '').trim();
    const quantity = Number(row[columnIndex.cantidad]);
    if (!code || !client || !product || !Number.isInteger(quantity) || quantity < 0) {
      throw new Error(`La fila ${match.headerRowIndex + index + 2} de ${match.sheetName} debe incluir Cod_Ped, Cod_cliente, Producto y una Cantidad entera válida.`);
    }
    return { code, client, product, quantity };
  });
};
