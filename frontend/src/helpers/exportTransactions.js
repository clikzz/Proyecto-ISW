import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDate } from '@/helpers/dates';

const formatoPesoChileno = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

export const exportTransactionsToPDF = (transactions) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Resumen de Transacciones", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  const tableColumn = ["Fecha", "Tipo", "Descripción", "Monto", "Método de Pago", "RUT"];
  const tableRows = transactions.map(t => [
    formatDate(t.transaction_date),
    t.transaction_type,
    t.description,
    formatoPesoChileno(t.amount),
    t.payment_method,
    t.rut
  ]);

  doc.autoTable(tableColumn, tableRows, {
    startY: 25,
    margin: { top: 25, right: 15, bottom: 15, left: 15 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 25 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
    },
    theme: 'grid',
    didDrawPage: function(data) {
      if (data.pageNumber > 1) {
        doc.setFontSize(16);
        doc.text("Resumen de Transacciones", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      }
    }
  });
  doc.save("transacciones.pdf");
};

