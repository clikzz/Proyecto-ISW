'use client';

import ServicesTable from '@/components/services/ServicesTable';
import { Wrench } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-6 lg:px-10">
      <div className="flex items-center mb-6">
        <Wrench size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Servicios</h1>
      </div>
      <ServicesTable/>
    </div>
  );
}
