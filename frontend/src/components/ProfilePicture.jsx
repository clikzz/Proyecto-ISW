import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { uploadProfilePicture, getProfile } from '@api/profile';
import ImageCropper from './ui/ImageCropper';

export default function ProfilePicture({ profilePicture, setProfilePicture }) {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);

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

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result); 
        setShowCropper(true); 
        document.body.style.overflow = 'hidden'; 
      };
      reader.readAsDataURL(file);
    }

    
    event.target.value = '';
  };

  const handleSaveCroppedImage = async (blob) => {
    try {
      const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      const data = await uploadProfilePicture(croppedFile);
      setProfilePicture(data.profilePicture);
      setShowCropper(false);
      setTempImage(null);
      document.body.style.overflow = 'auto'; 
    } catch (error) {
      console.error('Error al guardar la imagen recortada:', error.message);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImage(null);
    document.body.style.overflow = 'auto'; 
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const response = await removeProfilePicture();
      setProfilePicture(response.profilePicture); 
    } catch (error) {
      console.error('Error al eliminar la imagen de perfil:', error.message);
    }
  };

  return (
    <section className="flex flex-col items-center space-y-4">
      <div className="relative">
        <figure className="w-32 h-32 rounded-full overflow-hidden shadow-md">
          <img
            key={profilePicture}
            src={profilePicture}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        </figure>
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

      {showCropper && tempImage && (
        <ImageCropper
          src={tempImage}
          onSave={handleSaveCroppedImage}
          onCancel={handleCancelCrop}
        />
      )}
    </section>
  );
}
