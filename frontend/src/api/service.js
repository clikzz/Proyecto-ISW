import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/services`, 
});

// Obtener todos los servicios
export const getServices = async (category = '') => {
  try {
    const url = category ? `/all/${category}` : '/all';
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los servicios:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener un servicio por su ID
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/get/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el servicio:', error.response?.data || error.message);
    throw error;
  }
};

// Crear un nuevo servicio
export const createService = async (newService) => {
  try {
    const response = await api.post('/create', newService, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el servicio:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un servicio
export const updateService = async (id, updatedService) => {
  try {
    const response = await api.put(`/update/${id}`, updatedService, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el servicio:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un servicio
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el servicio:', error.response?.data || error.message);
    throw error;
  }
};
