const User = require('../models/User');
const {
  updateUserProfile,
  changeUserPassword,
} = require('../services/profile.service');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');


exports.updateProfile = async (req, res) => {
  try {
    const { name_user, phone_user } = req.body;
    const rut = req.user.rut; 

    const updates = {};
    if (name_user) updates.name_user = name_user;
    if (phone_user) updates.phone_user = phone_user;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: 'No se proporcionaron datos para actualizar' });
    }
    const updatedUser = await updateUserProfile(rut, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const rut = req.user.rut; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'La contraseña actual y la nueva contraseña son obligatorias',
      });
    }

    await changeUserPassword(rut, currentPassword, newPassword);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    if (
      error.message === 'Usuario no encontrado' ||
      error.message === 'La contraseña actual es incorrecta'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const rut = req.user.rut;
    const user = await User.findByRut(rut);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { name_user, phone_user, created_at, updated_at, role_user, profile_picture } = user;
    res.json({ name_user, phone_user, rut, created_at, updated_at, role_user, profile_picture });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};


exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    }
    cloudinary.uploader.upload_stream(
        {
          folder: 'profile_pictures', 
          width: 200, 
          height: 200, 
          crop: 'fill', 
          gravity: 'face', 
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error al subir la imagen', error });
          }
          
          const updates = { profile_picture: result.secure_url };
          const user = await User.findByRutAndUpdate(req.user.rut, updates);

          if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          res.status(200).json({
            message: 'Imagen de perfil actualizada',
            profilePicture: result.secure_url,
          });
        }
      ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la imagen', error });
  }
};
