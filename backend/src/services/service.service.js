const Service = require('../models/Service');

const createService = async (data) => {
  if (!['reparación', 'mantención', 'personalización'].includes(data.category)) {
    throw new Error('La categoría proporcionada no es válida.');
  }
  return await Service.create(data);
};

const getAllServices = async (category) => {
  if (category && !['reparación', 'mantención', 'personalización'].includes(category)) {
    throw new Error('La categoría proporcionada no es válida.');
  }
  return category
    ? await Service.findAllByCategory(category) 
    : await Service.findAll();
};

const getServiceById = async (id) => await Service.findById(id);
const updateService = async (id, data) => await Service.update(id, data);
const deleteService = async (id) => await Service.delete(id);

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
