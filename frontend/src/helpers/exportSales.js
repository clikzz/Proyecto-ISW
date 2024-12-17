import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (sales) => {
  const mappedSales = sales.map((sale) => ({
    Producto: sale.name_item,
    Categoría: capitalize(sale.category),
    Cantidad: sale.quantity_item,
    Monto: `$${sale.amount?.toLocaleString('es-CL')}`,
    'Método de Pago': capitalize(sale.payment_method),
    Descripción: capitalize(sale.description) || 'Sin descripción',
    Fecha: formatDateTime(sale.transaction_date),
    Modificado: formatDateTime(sale.updated_at),
  }));

  const worksheet = utils.json_to_sheet(mappedSales);

  const colWidths = [
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
  ];
  worksheet['!cols'] = colWidths;

  utils.sheet_add_aoa(
    worksheet,
    [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Fecha', 'Modificado']],
    { origin: 'A1' }
  );

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Ventas');

  writeFile(workbook, 'Ventas.xlsx');
};

export const exportToPDF = (sales) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Reporte de Ventas', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generado el: ${formatDateTime(new Date())}`, 14, 30);

  const tableData = sales.map((sale) => [
    sale.name_item,
    capitalize(sale.category),
    sale.quantity_item,
    `$${sale.amount?.toLocaleString('es-CL')}`,
    capitalize(sale.payment_method),
    capitalize(sale.description) || 'Sin descripción',
    formatDateTime(sale.transaction_date),
    formatDateTime(sale.updated_at),
  ]);

  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Fecha', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [231, 76, 60] },
  });

  doc.save('Ventas.pdf');
};