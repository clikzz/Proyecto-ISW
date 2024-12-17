const serviceService = require('../services/service.service');
const { createServiceSchema, updateServiceSchema } = require('../validations/service.validation');

exports.createService = async (req, res) => {
  try {
    const { error } = createServiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const validCategories = ['reparación', 'mantenimiento', 'personalización', 'otro'];
    if (!validCategories.includes(req.body.category)) {
      return res.status(400).json({ message: `La categoría debe ser una de las siguientes: ${validCategories.join(', ')}` });
    }

    const newService = await serviceService.createService(req.body);
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el servicio', error: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const { category } = req.params; 
    const services = await serviceService.getAllServices(category);
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los servicios', error: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el servicio', error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { error } = updateServiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedService = await serviceService.updateService(req.params.id, req.body);
    if (!updatedService) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error: err.message });
  }
};


exports.deleteService = async (req, res) => {
  try {
    const deletedService = await serviceService.deleteService(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Servicio no encontrado para eliminar' });
    }
    res.json({ message: 'Servicio eliminado correctamente', service: deletedService });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error: err.message });
  }
};

