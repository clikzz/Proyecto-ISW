// src/services/apiService.js
import axios from 'axios';

// Configura la URL base de tu API
const api = axios.create({
  baseURL: 'http://tu-api.com/api/users', // Cambia esto a la URL real de tu API
});

// Función para registrar un usuario
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

// Función para iniciar sesión
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
