import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (purchases) => {
  const mappedPurchases = purchases.map((purchase) => ({
    Producto: purchase.name_item,
    Categoría: capitalize(purchase.category),
    Cantidad: purchase.quantity_item,
    Monto: `$${purchase.amount?.toLocaleString('es-CL')}`,
    'Método de Pago': capitalize(purchase.payment_method),
    Descripción: capitalize(purchase.description) || 'Sin descripción',
    Proveedor: purchase.name_supplier || 'Desconocido',
    Fecha: formatDateTime(purchase.transaction_date),
    Modificado: formatDateTime(purchase.updated_at),
  }));

  const worksheet = utils.json_to_sheet(mappedPurchases);

  const colWidths = [
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
  ];
  worksheet['!cols'] = colWidths;

  utils.sheet_add_aoa(
    worksheet,
    [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Proveedor', 'Fecha', 'Modificado']],
    { origin: 'A1' }
  );

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Compras');

  writeFile(workbook, 'Compras.xlsx');
};

export const exportToPDF = (purchases) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Reporte de Compras', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generado el: ${formatDateTime(new Date())}`, 14, 30);

  const tableData = purchases.map((purchase) => [
    purchase.name_item,
    capitalize(purchase.category),
    purchase.quantity_item,
    `$${purchase.amount?.toLocaleString('es-CL')}`,
    capitalize(purchase.payment_method),
    capitalize(purchase.description) || 'Sin descripción',
    purchase.name_supplier || 'Desconocido',
    formatDateTime(purchase.transaction_date),
    formatDateTime(purchase.updated_at),
  ]);

  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Proveedor', 'Fecha', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save('Compras.pdf');
};