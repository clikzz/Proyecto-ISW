import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={() => setActiveTab('Datos Personales')}
        className={`py-2 px-4 ${
          activeTab === 'Datos Personales'
            ? 'border-b-2 border-primary font-semibold'
            : 'text-gray-500'
        }`}
      >
        Datos Personales
      </button>
      <button
        onClick={() => setActiveTab('Seguridad')}
        className={`py-2 px-4 ${
          activeTab === 'Seguridad'
            ? 'border-b-2 border-primary font-semibold'
            : 'text-gray-500'
        }`}
      >
        Seguridad
      </button>
    </div>
  );
}
