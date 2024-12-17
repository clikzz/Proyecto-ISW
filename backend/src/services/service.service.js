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

    // combina los datos existentes con los datos nuevos
    const updatedData = {
      ...service, // existentes
      ...data,    // actualizados
    };

    // actualiza el servicio con los datos combinados
    const updatedService = await Service.update(id, updatedData);

    return updatedService;
  } catch (error) {
    throw error;
  }
};


const deleteService = async (id) => await Service.delete(id);


module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
