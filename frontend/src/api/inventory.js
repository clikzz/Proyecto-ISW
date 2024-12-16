import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
});

// Obtener todos los items
export const getInventoryItems = async () => {
  try {
    const response = await api.get('/items/all', {
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

// Obtener un item por su ID
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/get/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el item:', error.response?.data || error.message);
    throw error;
  }
};

// Añadir un nuevo item
export const addItem = async (newItem) => {
  try {
    const response = await api.post('/items/create', newItem, {
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

// Actualizar un item existente
export const updateItem = async (id, updatedItem) => {
  try {
    const response = await api.put(`/items/update/${id}`, updatedItem, {
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

// Eliminar un item
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/delete/${id}`, {
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

// Registrar una compra
export const recordPurchase = async (purchase) => {
  try {
    console.log('Datos enviados para compra:', purchase);
    const response = await api.post('/inventory/purchase', purchase, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar la compra:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una compra
export const updatePurchase = async (id, updatedFields) => {
  try {
    const response = await api.put(`inventory/purchases/update/${id}`, updatedFields, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la compra:', error.response?.data || error.message);
    throw error;
  }
};

// Registrar una venta
export const recordSale = async (sale) => {
  try {
    console.log('Datos enviados para venta:', sale);
    const response = await api.post('/inventory/sale', sale, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    console.error('Error al registrar la venta:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Obtener todas las compras
export const getPurchases = async () => {
  try {
    const response = await api.get('/inventory/purchases', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las compras:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener todas las ventas
export const getSales = async () => {
  try {
    const response = await api.get('/inventory/sales', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las ventas:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una venta
export const updateSale = async (id, updatedFields) => {
  try {
    const response = await api.put(`inventory/sales/update/${id}`, updatedFields, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la venta:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar una venta
export const deleteSale = async (id) => {
  try {
    const response = await api.delete(`/inventory/sales/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la venta:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar una compra
export const deletePurchase = async (id) => {
  try {
    console.log('ID de la compra a eliminar al llamar a la api:', id);
    const response = await api.delete(`/inventory/purchases/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la compra:', error.response?.data || error.message);
    throw error;
  }
};
