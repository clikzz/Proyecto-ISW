import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/inventory`,
});

export const getInventoryItems = async () => {
  try {
    const response = await api.get('/items', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el inventario:', error.response?.data || error.message);
    throw error;
  }
};

export const addItem = async (newItem) => {
  try {
    const response = await api.post('/add', newItem, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al añadir item:', error.response?.data || error.message);
    throw error;
  }
};

export const updateItem = async (id, updatedItem) => {
  try {
    const response = await api.put(`/update/${id}`, updatedItem, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar item:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar item:', error.response?.data || error.message);
    throw error;
  }
};

export const recordTransaction = async (transaction) => {
  try {
    const response = await api.post('/transaction', transaction, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar transacción:', error.response?.data || error.message);
    throw error;
  }
};