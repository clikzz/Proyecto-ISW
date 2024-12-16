import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';

export const exportToExcel = (purchases) => {
  // Mapeo de los datos de las compras
  const mappedPurchases = purchases.map((purchase) => ({
    Producto: purchase.name_item,
    Categoría: capitalize(purchase.category),
    Cantidad: purchase.quantity_item,
    Monto: `$${purchase.amount?.toLocaleString('es-CL')}`,
    'Método de Pago': capitalize(purchase.payment_method),
    Proveedor: purchase.name_supplier || 'Desconocido',
    Fecha: new Date(purchase.transaction_date).toLocaleDateString(),
    Modificado: new Date(purchase.updated_at).toLocaleDateString(),
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
    { wch: 25 }, // Proveedor
    { wch: 15 }, // Fecha
    { wch: 15 }, // Modificado
  ];
  worksheet['!cols'] = colWidths;

  // Agregar encabezados manualmente
  utils.sheet_add_aoa(
    worksheet,
    [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Proveedor', 'Fecha', 'Modificado']],
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
    purchase.name_supplier || 'Desconocido',
    new Date(purchase.transaction_date).toLocaleDateString(),
    new Date(purchase.updated_at).toLocaleDateString(),
  ]);

  // Crear tabla en el PDF
  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Cantidad', 'Monto', 'Método de Pago', 'Proveedor', 'Fecha', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [41, 128, 185] }, // Azul claro para encabezado
  });

  // Guardar PDF
  doc.save('Compras.pdf');
};