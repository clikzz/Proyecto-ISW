import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/user`,
});

export const getUsers = async () => {
  try {
    const response = await api.get('/getUsers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener usuarios:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addUser = async (newUser) => {
  try {
    const response = await api.post('/addUser', newUser, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al añadir usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteUser = async (rut) => {
  try {
    const response = await api.delete(`/deleteUser/${rut}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al eliminar usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUserRole = async (rut, newRole) => {
  try {
    const response = await api.put(
      `/updateUserRole/${rut}`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al actualizar rol de usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};
