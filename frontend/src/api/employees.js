import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/employees`,
});

export const getEmployees = async () => {
  try {
    const response = await api.get('/getEmployees', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener empleados:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addEmployee = async (newEmployee) => {
  try {
    const response = await api.post('/addEmployee', newEmployee, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al añadir empleado:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteEmployee = async (rut) => {
  try {
    const response = await api.delete(`/deleteEmployee/${rut}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error al eliminar empleado:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateEmployeeRole = async (rut, newRole) => {
  try {
    const response = await api.put(
      `/updateEmployeeRole/${rut}`, // Ensure this endpoint is correct
      { newRole },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al actualizar empleado:',
      error.response?.data || error.message
    );
    throw error;
  }
};
