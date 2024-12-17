import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (items) => {
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

  const worksheet = utils.json_to_sheet(mappedItems);

  const colWidths = [
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
  ];
  worksheet['!cols'] = colWidths;

  utils.sheet_add_aoa(
    worksheet,
    [['Nombre', 'Categoría', 'Stock', 'Precio Venta', 'Descripción', 'Proveedor', 'Registrado', 'Modificado']],
    { origin: 'A1' }
  );

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Inventario');

  writeFile(workbook, 'Inventario.xlsx');
};

export const exportToPDF = (items) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Inventario de Productos', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generado el: ${formatDateTime(new Date())}`, 14, 30);

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

  autoTable(doc, {
    head: [['Nombre', 'Categoría', 'Stock', 'Precio Venta', 'Descripción', 'Proveedor', 'Registrado', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save('Inventario.pdf');
};