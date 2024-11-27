const Service = require('../models/Service');

const createService = async (data) => await Service.create(data);
const getAllServices = async () => await Service.findAll();
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
