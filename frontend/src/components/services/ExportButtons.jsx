import React from 'react';
import { FileSpreadsheet, FileText, Plus } from 'lucide-react';
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
        className="bg-green-600 hover:bg-green-700"
        title="Exportar a Excel"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button
        onClick={handleExportPDF}
        className="bg-red-600 hover:bg-red-700"
        title="Exportar a PDF"
      >
        <FileText className="mr-2 h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
