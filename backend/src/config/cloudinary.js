const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subida de imagen con transformación
cloudinary.uploader.upload('ruta-de-tu-imagen-local', {
  folder: 'perfiles', // Carpeta en Cloudinary
  width: 200,         // Ancho deseado
  height: 200,        // Alto deseado
  crop: 'fill',       // Recorta para llenar el tamaño
  gravity: 'face',    // Centra en el rostro (si es un perfil)
}, (error, result) => {
  if (error) {
    console.error('Error al subir imagen:', error);
  } else {
    console.log('Imagen subida con éxito:', result.secure_url);
  }
});

module.exports = cloudinary;
