
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/profile`, 
});

export const getProfile = async () => {
  try {
    console.log("Iniciando solicitud para obtener el perfil...");
    const response = await api.get('/getProfile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("Perfil obtenido:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener el perfil:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/update', profileData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al actualizar el perfil:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/change-password', passwordData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al cambiar la contraseña:',
      error.response?.data || error.message
    );
    throw error;
  }
};


