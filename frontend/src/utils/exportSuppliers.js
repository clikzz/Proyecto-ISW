import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (suppliers) => {
  const worksheet = utils.json_to_sheet(suppliers);

  // Set column widths
  const colWidths = [
    { wch: 15 }, // RUT
    { wch: 30 }, // Name
    { wch: 15 }, // Phone
    { wch: 30 }, // Email
    { wch: 40 }, // Address
  ];
  worksheet['!cols'] = colWidths;

  // Rename headers
  utils.sheet_add_aoa(
    worksheet,
    [['RUT', 'Nombre', 'Teléfono', 'Correo', 'Dirección']],
    { origin: 'A1' }
  );

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Proveedores');

  writeFile(workbook, 'Proveedores.xlsx');
};

export const exportToPDF = (suppliers) => {
  const doc = new jsPDF();

  // Add title with styling
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text('Lista de Proveedores', 14, 20);

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  // Prepare data for table
  const tableData = suppliers.map((supplier) => [
    supplier.rut_supplier,
    supplier.name_supplier,
    supplier.phone_supplier,
    supplier.email_supplier,
    supplier.address_supplier,
  ]);

  // Add table with improved styling
  autoTable(doc, {
    head: [['RUT', 'Nombre', 'Teléfono', 'Correo', 'Dirección']],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 35 },
    didDrawPage: function (data) {
      // Add page number at the bottom
      doc.setFontSize(8);
      doc.text(
        `Página ${doc.internal.getCurrentPageInfo().pageNumber}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save('Proveedores.pdf');
};
