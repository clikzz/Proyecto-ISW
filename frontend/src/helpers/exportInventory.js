import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (items) => {
  // Mapeo de los datos del inventario
  const mappedItems = items.map((item) => ({
    Nombre: item.name_item,
    Categoría: capitalize(item.category),
    Stock: item.stock,
    'Precio Venta': item.selling_price,
    Descripción: capitalize(item.description) || 'Sin descripción',
    Proveedor: item.suppliers?.join(', ') || 'No Registrado',
    Registrado: formatDateTime(item.created_at),
    Modificado: formatDateTime(item.updated_at),
  }));

  // Crear hoja de Excel
  const worksheet = utils.json_to_sheet(mappedItems);

  // Definir anchos de columnas
  const colWidths = [
    { wch: 20 }, // Nombre
    { wch: 20 }, // Categoría
    { wch: 10 }, // Stock
    { wch: 20 }, // Precio Venta
    { wch: 30 }, // Descripción
    { wch: 30 }, // Proveedor
    { wch: 20 }, // Registrado
    { wch: 20 }, // Modificado
  ];
  worksheet['!cols'] = colWidths;

  // Agregar encabezados manualmente
  utils.sheet_add_aoa(
    worksheet,
    [['Nombre', 'Categoría', 'Stock', 'Precio Venta', 'Descripción', 'Proveedor', 'Registrado', 'Modificado']],
    { origin: 'A1' }
  );

  // Crear libro de trabajo y exportar
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Inventario');

  writeFile(workbook, 'Inventario.xlsx');
};

export const exportToPDF = (items) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(20);
  doc.text('Inventario de Productos', 14, 20);

  // Fecha de generación
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  // Preparar datos para la tabla
  const tableData = items.map((item) => [
    item.name_item,
    capitalize(item.category),
    item.stock,
    `$${item.selling_price?.toLocaleString('es-CL')}`,
    capitalize(item.description) || 'Sin descripción',
    item.suppliers?.join(', ') || 'No Registrado',
    formatDateTime(item.created_at),
    formatDateTime(item.updated_at),
  ]);

  // Crear tabla en el PDF
  autoTable(doc, {
    head: [['Nombre', 'Categoría', 'Stock', 'Precio Venta', 'Descripción', 'Proveedor', 'Registrado', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [22, 160, 133] }, // Verde claro para encabezado
  });

  doc.save('Inventario.pdf');
};