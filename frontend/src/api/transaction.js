import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/transactions`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllTransactions = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/', transactionData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateTransaction = async (id, updateData) => {
  try {
    const response = await api.put(`/${id}`, updateData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTransactionsSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const handleApiError = (error) => {
  if (error.response) {
    console.error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
  } else if (error.request) {
    console.error('Network Error: No response received');
  } else {
    console.error('Error:', error.message);
  }
  throw error;
};

export default {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsSummary,
};
