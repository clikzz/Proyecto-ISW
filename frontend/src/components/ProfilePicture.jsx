import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { uploadProfilePicture, getProfile } from '@api/profile'; // Subida a Cloudinary
import ImageCropper from './ui/ImageCropper'; // Componente del recortador

export default function ProfilePicture({ profilePicture, setProfilePicture }) {
  const [showCropper, setShowCropper] = useState(false); // Controlar el recortador
  const [tempImage, setTempImage] = useState(null); // Imagen temporal para recortar

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfilePicture(profileData.profile_picture);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    fetchProfile();
  }, []);

  // Manejar el cambio de archivo (selección de imagen)
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result); // Cargar la imagen como base64
        setShowCropper(true); // Mostrar el recortador
      };
      reader.readAsDataURL(file); // Convertir el archivo a base64
    }
  };

  // Guardar la imagen recortada
  const handleSaveCroppedImage = async (blob) => {
    try {
      // Crear un objeto File a partir del blob recortado
      const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

      // Subir la imagen recortada a Cloudinary
      const data = await uploadProfilePicture(croppedFile);

      // Actualizar el estado con la nueva URL
      setProfilePicture(data.profilePicture);

      // Limpiar el estado
      setShowCropper(false);
      setTempImage(null);
    } catch (error) {
      console.error('Error al guardar la imagen recortada:', error.message);
    }
  };

  // Cancelar el recorte
  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImage(null);
  };

  return (
    <section className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Imagen de perfil */}
        <figure className="w-32 h-32 rounded-full overflow-hidden shadow-md">
          <img
            key={profilePicture}
            src={profilePicture}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Botón para cargar nueva imagen */}
        <label
          htmlFor="profile-picture"
          className="absolute bottom-2 right-2 p-2 bg-primary rounded-full cursor-pointer hover:bg-accent transition-colors flex items-center justify-center"
        >
          <Camera className="h-5 w-5 text-white" />
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Modal del recortador */}
      {showCropper && tempImage && (
        <ImageCropper
          src={tempImage} // Imagen seleccionada
          onSave={handleSaveCroppedImage} // Guardar recorte
          onCancel={handleCancelCrop} // Cancelar recorte
        />
      )}
    </section>
  );
}
