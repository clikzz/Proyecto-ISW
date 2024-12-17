import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';

export const exportTransactionsToPDF = (transactions) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("Resumen de Transacciones", 14, 20);

  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${formattedDate}`, 14, 30);

  const tableColumn = ["Fecha", "Tipo", "Descripción", "Monto", "Método de Pago", "RUT"];
  const tableRows = transactions.map(t => [
    formatDate(t.transaction_date),
    capitalize(t.transaction_type),
    capitalize(t.description),
    `$${t.amount?.toLocaleString('es-CL')}`,
    capitalize(t.payment_method),
    t.rut || 'Sin asignar'
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
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

  doc.save("transacciones.pdf");
};
