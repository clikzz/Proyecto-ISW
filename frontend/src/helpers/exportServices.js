import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from '@/helpers/capitalize';
import { formatDateTime } from '@/helpers/dates';

export const exportToExcel = (services) => {
  const mappedServices = services.map((service) => ({
    Nombre: capitalize(service.name_service),
    Descripción: capitalize(service.description_service) || 'Sin descripción',
    Precio: service.price_service,
    Categoría: capitalize(service.category),
    'Método de Pago': capitalize(service.payment_method_service),
    Empleado: service.employee_name || 'Sin asignar',
    Registrado: formatDateTime(service.created_at),
    Modificado: formatDateTime(service.updated_at),
  }));

  const worksheet = utils.json_to_sheet(mappedServices);

  const colWidths = [
    { wch: 20 }, // Nombre
    { wch: 30 }, // Descripción
    { wch: 15 }, // Precio
    { wch: 20 }, // Categoría
    { wch: 20 }, // Método de Pago
    { wch: 30 }, // Empleado
    { wch: 20 }, // Registrado
    { wch: 20 }, // Modificado
  ];
  worksheet['!cols'] = colWidths;

  utils.sheet_add_aoa(
    worksheet,
    [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Método de Pago', 'Empleado', 'Registrado', 'Modificado']],
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
    capitalize(service.name_service),
    capitalize(service.description_service) || 'Sin descripción',
    `$${service.price_service?.toLocaleString('es-CL')}`,
    capitalize(service.category),
    capitalize(service.payment_method_service),
    service.employee_name || 'Sin asignar',
    formatDateTime(service.created_at),
    formatDateTime(service.updated_at),
  ]);

  // Crear tabla
  autoTable(doc, {
    head: [['Nombre', 'Descripción', 'Precio', 'Categoría', 'Método de Pago', 'Empleado', 'Registrado', 'Modificado']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save('Servicios.pdf');
};

