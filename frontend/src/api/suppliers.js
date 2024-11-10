import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/suppliers`,
});

export const getSuppliers = async () => {
  try {
    const response = await api.get('/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener proveedores:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addSupplier = async (data) => {
  try {
    const response = await api.post('/create', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al crear proveedor:',
      error.response?.data || error.message
    );
    throw error;
  }
};
