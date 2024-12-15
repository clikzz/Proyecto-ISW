import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/task`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const assignTask = async (taskId, rut) => {
  try {
    const response = await api.put(`/${taskId}`, { rut });
    return response.data;
  } catch (error) {
    console.error('Error al asignar la tarea:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.put(`/${taskId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el estado de la tarea:', error);
    throw error;
  }
};
