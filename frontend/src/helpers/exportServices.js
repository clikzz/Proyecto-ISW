import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (services) => {
  const worksheet = utils.json_to_sheet(services);


  const colWidths = [
    { wch: 20 }, // Nombre
    { wch: 30 }, // Descripción
    { wch: 15 }, // Precio
    { wch: 20 }, // Categoría
    { wch: 15 }, // Fecha
  ];
  worksheet['!cols'] = colWidths;


  utils.sheet_add_aoa(
    worksheet,
    [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Fecha']],
    { origin: 'A1' }
  );

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Servicios');

  writeFile(workbook, 'Servicios.xlsx');
};

export const exportToPDF = (services) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text('Lista de Servicios', 14, 20);

  // Fecha
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  // Preparar datos para la tabla
  const tableData = services.map((service) => [
    service.name_service,
    service.description_service,
    service.price_service.toFixed(2),
    service.category,
    new Date(service.date_service).toLocaleDateString(),
  ]);

  // Agregar tabla con estilos
  autoTable(doc, {
    head: [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Fecha']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save('Servicios.pdf');
};
