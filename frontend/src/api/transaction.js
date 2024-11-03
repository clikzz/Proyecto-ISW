import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/transactions`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Asumiendo que el token se almacena en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllTransactions = async () => {
  try {
    console.log('Fetching transactions from:', `${API_URL}/transactions`);
    const response = await api.get('/');
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      if (error.response.status === 404) {
        console.error('Resource not found (404)');
        return { message: 'Resource not found (404)' }; // Return a user-friendly message
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error; // Re-throw the error to be handled by the calling function if needed
  }
};

export const createTransaction = async (transactionData) => {
  try {
    console.log(transactionData);
    const response = await api.post('/', transactionData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      if (error.response.status === 404) {
        console.error('Resource not found (404)');
        return { message: 'Resource not found (404)' };
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error;
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la transacción:', error);
    throw error;
  }
};

export const updateTransaction = async (id, updateData) => {
  try {
    const response = await api.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la transacción:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la transacción:', error);
    throw error;
  }
};

export const getTransactionsSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      if (error.response.status === 404) {
        console.error('Resource not found (404)');
        return { message: 'Resource not found (404)' };
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error;
  }
};

export default {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsSummary,
};
