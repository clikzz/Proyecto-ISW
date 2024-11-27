import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
});

// Registrar una nueva transacción
export const createTransaction = async (transaction) => {
  try {
    const response = await api.post('/transactions/create', transaction, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar la transacción:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener todas las transacciones
export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las transacciones:', error.response?.data || error.message);
    throw error;
  }
};
