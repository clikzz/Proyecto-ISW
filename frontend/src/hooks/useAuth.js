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
