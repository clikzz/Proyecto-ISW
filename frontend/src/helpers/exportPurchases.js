import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (purchases) => {
  // Mapeo de los datos de las compras
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

  // Crear hoja de Excel
  const worksheet = utils.json_to_sheet(mappedPurchases);

  // Definir anchos de columnas
  const colWidths = [
    { wch: 20 }, // Producto
    { wch: 20 }, // Categoría
    { wch: 10 }, // Cantidad
    { wch: 15 }, // Monto
    { wch: 20 }, // Método de Pago
    { wch: 30 }, // Descripción
    { wch: 25 }, // Proveedor
    { wch: 15 }, // Fecha
    { wch: 15 }, // Modificado
  ];
  worksheet['!cols'] = colWidths;

  // Agregar encabezados manualmente
  utils.sheet_add_aoa(
    worksheet,
    [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Proveedor', 'Fecha', 'Modificado']],
    { origin: 'A1' }
  );

  // Crear libro de trabajo y exportar
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Compras');

  writeFile(workbook, 'Compras.xlsx');
};

export const exportToPDF = (purchases) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(20);
  doc.text('Reporte de Compras', 14, 20);

  // Fecha de generación
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  // Preparar datos para la tabla
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

  // Crear tabla en el PDF
  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Descripción', 'Proveedor', 'Fecha', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [41, 128, 185] }, // Azul claro para encabezado
  });

  doc.save('Compras.pdf');
};