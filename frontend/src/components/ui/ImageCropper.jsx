import React, { useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default function ImageCropper({ src, onSave, onCancel }) {
  const cropperRef = useRef(null);
  const cropperInstanceRef = useRef(null);

  useEffect(() => {
    const imageElement = cropperRef.current;

    if (imageElement) {
      cropperInstanceRef.current = new Cropper(imageElement, {
        aspectRatio: 1, // Relación de aspecto cuadrada
        viewMode: 1, // Permitir mover la imagen dentro del área
        autoCropArea: 0.9, // Tamaño inicial del área de recorte
        movable: true, // Habilitar movimiento
        zoomable: true, // Permitir zoom
        scalable: true, // Permitir escalar
        guides: false, // Ocultar guías para un diseño más limpio
        background: true, // Mostrar un fondo blanco detrás de la imagen
        highlight: false, // Eliminar sombreado del cuadro
        dragMode: 'move', // Permitir arrastrar directamente
        cropBoxMovable: true, // Mover cuadro de recorte
        cropBoxResizable: true, // Redimensionar cuadro de recorte
      });
    }

    return () => {
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
        cropperInstanceRef.current = null;
      }
    };
  }, [src]);

  const handleSave = () => {
    if (cropperInstanceRef.current) {
      const canvas = cropperInstanceRef.current.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      canvas.toBlob((blob) => {
        onSave(blob); // Enviar el blob al componente padre
      });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro translúcido
        backdropFilter: 'blur(4px)', // Efecto de desenfoque
      }}
    >
      <div
        className="rounded-lg shadow-lg p-6 w-11/12 max-w-lg"
        style={{
          backgroundColor: 'var(--card)', // Fondo del modal adaptado al tema
          color: 'var(--card-foreground)', // Color de texto
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Recorta tu imagen
        </h2>
        <div
          className="border rounded-lg overflow-hidden mb-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <img
            ref={cropperRef}
            src={src}
            alt="Imagen para recortar"
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg font-medium shadow hover:scale-105 transition"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            Guardar
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg font-medium shadow hover:scale-105 transition"
            style={{
              backgroundColor: 'var(--muted)',
              color: 'var(--muted-foreground)',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
