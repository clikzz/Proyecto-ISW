import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/tasks`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const assignTask = async (taskId, workerId) => {
  try {
    const response = await api.put(`/${taskId}/assign`, { workerId });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
