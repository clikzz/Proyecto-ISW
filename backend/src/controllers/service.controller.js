const serviceService = require('../services/service.service');

exports.createService = async (req, res) => {
  try {
    const newService = await serviceService.createService(req.body);
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el servicio', error: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los servicios', error: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el servicio', error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updatedService = await serviceService.updateService(req.params.id, req.body);
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el servicio', error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deletedService = await serviceService.deleteService(req.params.id);
    res.json({ message: 'Servicio eliminado correctamente', service: deletedService });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el servicio', error: err.message });
  }
};
