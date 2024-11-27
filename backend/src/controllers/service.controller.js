const serviceService = require('../services/service.service');
const { createServiceSchema, updateServiceSchema } = require('../validations/service.validation');

exports.createService = async (req, res) => {
  try {
    console.log('Datos recibidos en createService:', req.body);

    const { error } = createServiceSchema.validate(req.body);
    if (error) {
      console.error('Error de validación:', error.details[0].message); 
      return res.status(400).json({ message: error.details[0].message });
    }

    const newService = await serviceService.createService(req.body);
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error al crear el servicio:', err.message);
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
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(service);
  } catch (err) {
    console.error('Error al obtener el servicio:', err.message);
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
    console.error('Error al actualizar el servicio:', err.message);
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
    console.error('Error al eliminar el servicio:', err.message);
    res.status(500).json({ message: 'Error al eliminar el servicio', error: err.message });
  }
};

