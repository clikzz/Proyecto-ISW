import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/auth`,
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error(
      'Error en el registro:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const loginUser = async (rut, password) => {
  try {
    const response = await api.post('/login', { rut, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error(
      'Error al solicitar restablecimiento de contraseña:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error(
      'Error al restablecer la contraseña:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const validateToken = async (token) => {
  try {
    const response = await api.post('/validate-token', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error('Token is invalid or expired');
    } else {
      console.error(
        'Error al validar el token:',
        error.response?.data || error.message
      );
    }
    return false;
  }
};
