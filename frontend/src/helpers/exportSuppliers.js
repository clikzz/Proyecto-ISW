import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (suppliers) => {
  const worksheet = utils.json_to_sheet(suppliers);

  const colWidths = [
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 30 },
    { wch: 40 },
  ];
  worksheet['!cols'] = colWidths;

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

  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text('Lista de Proveedores', 14, 20);

  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${formattedDate}`, 14, 30);

  const tableData = suppliers.map((supplier) => [
    supplier.rut_supplier,
    supplier.name_supplier,
    supplier.phone_supplier,
    supplier.email_supplier,
    supplier.address_supplier,
  ]);

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
