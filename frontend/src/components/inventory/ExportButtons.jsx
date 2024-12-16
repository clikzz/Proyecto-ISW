import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExportButtons = ({ data, handleExportExcel, handleExportPDF }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={() => handleExportExcel(data)} variant="excel">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Exportar a Excel
      </Button>
      <Button onClick={() => handleExportPDF(data)} variant="pdf">
        <FileText className="mr-2 h-4 w-4" />
        Exportar a PDF
      </Button>
    </div>
  );
};

export default ExportButtons;