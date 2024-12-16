import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';

export const exportToExcel = (items) => {
  // Mapeo de los datos del inventario
  const mappedItems = items.map((item) => ({
    Nombre: item.name_item,
    Categoría: capitalize(item.category),
    'Precio Venta': item.selling_price,
    Stock: item.stock,
    Descripción: capitalize(item.description) || 'Sin descripción',
    Proveedor: item.suppliers?.join(', ') || 'No Registrado',
    Registrado: new Date(item.created_at).toLocaleDateString(),
    Modificado: new Date(item.updated_at).toLocaleDateString(),
  }));

  // Crear hoja de Excel
  const worksheet = utils.json_to_sheet(mappedItems);

  // Definir anchos de columnas
  const colWidths = [
    { wch: 20 }, // Nombre
    { wch: 20 }, // Categoría
    { wch: 15 }, // Precio Venta
    { wch: 10 }, // Stock
    { wch: 30 }, // Descripción
    { wch: 30 }, // Proveedor
    { wch: 15 }, // Registrado
  ];
  worksheet['!cols'] = colWidths;

  // Agregar encabezados manualmente
  utils.sheet_add_aoa(
    worksheet,
    [['Nombre', 'Categoría', 'Precio Venta', 'Stock', 'Descripción', 'Proveedor', 'Registrado']],
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
    `$${item.selling_price?.toLocaleString('es-CL')}`,
    item.stock,
    capitalize(item.description) || 'Sin descripción',
    item.suppliers?.join(', ') || 'No Registrado',
    new Date(item.created_at).toLocaleDateString(),
  ]);

  // Crear tabla en el PDF
  autoTable(doc, {
    head: [['Nombre', 'Categoría', 'Precio Venta', 'Stock', 'Descripción', 'Proveedor', 'Registrado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [22, 160, 133] }, // Verde claro para encabezado
  });

  // Guardar PDF
  doc.save('Inventario.pdf');
};