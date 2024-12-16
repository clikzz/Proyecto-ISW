import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToExcel, exportToPDF } from '@/helpers/exportServices';

export default function ExportButtons({ servicios }) {
  const handleExportExcel = () => {
    exportToExcel(servicios);
  };

  const handleExportPDF = () => {
    exportToPDF(servicios);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportExcel}
        title="Exportar a Excel"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button
        onClick={handleExportPDF}
        variant="pdf"
        title="Exportar a PDF"
      >
        <FileText className="mr-2 h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
