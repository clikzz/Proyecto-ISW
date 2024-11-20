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
        background: false, // Desactivar fondo oscuro por defecto
        highlight: true, // Mantener el cuadro de recorte destacado
        cropBoxMovable: true, // Permitir mover el cuadro
        cropBoxResizable: true, // Permitir redimensionar el cuadro
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
    <section
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(4px)', 
      }}
      role="dialog"
      aria-labelledby="cropper-modal-title"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-card rounded-lg shadow-lg p-6 w-11/12 max-w-lg z-60"
        style={{
          color: 'var(--card-foreground)', 
        }}
      >
        <header className="mb-4">
          <h2
            id="cropper-modal-title"
            className="text-2xl font-bold text-center"
          >
            Recorta tu imagen
          </h2>
        </header>
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
        <footer className="flex justify-end space-x-4">
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
        </footer>
      </div>
    </section>
  );
}
