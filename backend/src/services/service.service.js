const Service = require('../models/Service');

const createService = async (data) => {
  if (!['reparación', 'mantenimiento', 'personalización', 'otro'].includes(data.category)) {
    throw new Error('La categoría proporcionada no es válida.');
  }
  return await Service.create(data);
};

const getAllServices = async (category) => {
  if (category && !['reparación', 'mantenimiento', 'personalización', 'otro'].includes(category)) {
    throw new Error('La categoría proporcionada no es válida.');
  }
  return category
    ? await Service.findAllByCategory(category) 
    : await Service.findAll();
};

const getServiceById = async (id) => await Service.findById(id);


const updateService = async (id, data) => {
  try {
    const service = await Service.findById(id);
    if (!service) {
      throw new Error('Servicio no encontrado.');
    }

    await service.update(data);
    return service; 
  } catch (error) {
    console.error('Error al actualizar el servicio:', error.message);
    throw error;
  }
};

const deleteService = async (id) => {
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      throw new Error('Servicio no encontrado.');
    }

    await service.destroy();
    return { message: 'Servicio eliminado correctamente.' };
  } catch (error) {
    console.error('Error al eliminar el servicio:', error.message);
    throw error;
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
