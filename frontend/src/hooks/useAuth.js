import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:80/api/auth',
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data; // Aquí puedes manejar el nuevo usuario registrado
  } catch (error) {
    console.error(
      'Error en el registro:',
      error.response?.data || error.message
    );
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // Aquí puedes manejar el usuario que inició sesión
  } catch (error) {
    console.error(
      'Error en el inicio de sesión:',
      error.response?.data || error.message
    );
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data; // Aquí puedes manejar la respuesta del servidor
  } catch (error) {
    console.error(
      'Error al solicitar restablecimiento de contraseña:',
      error.response?.data || error.message
    );
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/reset-password', { token, newPassword });
    return response.data; // Aquí puedes manejar la respuesta del servidor
  } catch (error) {
    console.error(
      'Error al restablecer la contraseña:',
      error.response?.data || error.message
    );
    throw error; // Lanza el error para manejarlo en el componente
  }
};
