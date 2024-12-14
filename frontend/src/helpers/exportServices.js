import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (services) => {
  const mappedServices = services.map((service) => ({
    Nombre: service.name_service,
    Descripción: service.description_service,
    Precio: service.price_service,
    Categoría: service.category,
    'Método de Pago': service.payment_method_service,
  }));

  const worksheet = utils.json_to_sheet(mappedServices);

  const colWidths = [
    { wch: 20 }, // Nombre
    { wch: 30 }, // Descripción
    { wch: 15 }, // Precio
    { wch: 20 }, // Categoría
    { wch: 20 }, // Método de Pago
  ];
  worksheet['!cols'] = colWidths;

  utils.sheet_add_aoa(
    worksheet,
    [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Método de Pago']],
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
    service.price_service,
    service.category,
    service.payment_method_service,
    new Date(service.date_service).toLocaleDateString(),
  ]);

  // Crear tabla
  autoTable(doc, {
    head: [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Método de Pago']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save('Servicios.pdf');
};
