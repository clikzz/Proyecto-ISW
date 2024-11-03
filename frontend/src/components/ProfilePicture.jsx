import React from 'react';
import { Camera } from 'lucide-react';

export default function ProfilePicture({ profilePicture, setProfilePicture }) {
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="flex flex-col items-center space-y-4">
      <div className="relative">
        <figure className="w-32 h-32 rounded-full overflow-hidden shadow-md">
          <img
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
    </section>
  );
}
