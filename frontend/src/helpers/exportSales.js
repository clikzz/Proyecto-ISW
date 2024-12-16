import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (sales) => {
  // Mapeo de los datos de las ventas
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

  // Crear hoja de Excel
  const worksheet = utils.json_to_sheet(mappedSales);

  // Definir anchos de columnas
  const colWidths = [
    { wch: 20 }, // Producto
    { wch: 20 }, // Categoría
    { wch: 10 }, // Cantidad
    { wch: 15 }, // Monto
    { wch: 20 }, // Método de Pago
    { wch: 30 }, // Descripción
    { wch: 15 }, // Fecha
    { wch: 15 }, // Modificado
  ];
  worksheet['!cols'] = colWidths;

  // Agregar encabezados manualmente
  utils.sheet_add_aoa(
    worksheet,
    [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Fecha', 'Modificado']],
    { origin: 'A1' }
  );

  // Crear libro de trabajo y exportar
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Ventas');

  writeFile(workbook, 'Ventas.xlsx');
};

export const exportToPDF = (sales) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(20);
  doc.text('Reporte de Ventas', 14, 20);

  // Fecha de generación
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  // Preparar datos para la tabla
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

  // Crear tabla en el PDF
  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Fecha', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [231, 76, 60] }, // Rojo claro para encabezado
  });

  // Guardar PDF
  doc.save('Ventas.pdf');
};