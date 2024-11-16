const supplierService = require('../services/supplier.service');
const {
  createSupplierSchema,
  updateSupplierSchema,
} = require('../validations/supplier.validation');

exports.createSupplier = async (req, res) => {
  const { error } = createSupplierSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newSupplier = await supplierService.createSupplier(req.body);
    res.status(201).json(newSupplier);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al crear el proveedor', error: err.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.json(suppliers);
  } catch (err) {
    res
      .status(500)
      .json({
        message: 'Error al obtener los proveedores',
        error: err.message,
      });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(supplier);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al obtener el proveedor', error: err.message });
  }
};

exports.updateSupplier = async (req, res) => {
  const { error } = updateSupplierSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const currentSupplier = await supplierService.getSupplierById(
      req.params.id
    );
    if (!currentSupplier)
      return res.status(404).json({ message: 'Proveedor no encontrado' });

    const updatedData = {
      rut_supplier: req.body.rut_supplier || currentSupplier.rut_supplier,
      name_supplier: req.body.name_supplier || currentSupplier.name_supplier,
      phone_supplier: req.body.phone_supplier || currentSupplier.phone_supplier,
      email_supplier: req.body.email_supplier || currentSupplier.email_supplier,
      address_supplier:
        req.body.address_supplier || currentSupplier.address_supplier,
    };

    const updatedSupplier = await supplierService.updateSupplier(
      req.params.id,
      updatedData
    );
    res.json(updatedSupplier);
  } catch (err) {
    res
      .status(500)
      .json({
        message: 'Error al actualizar el proveedor',
        error: err.message,
      });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await supplierService.deleteSupplier(req.params.id);
    res.json({
      message: 'Proveedor eliminado correctamente',
      supplier: deletedSupplier,
    });
  } catch (err) {
    if (err.message === 'Proveedor no encontrado o ya eliminado') {
      return res.status(404).json({ message: err.message });
    }
    res
      .status(500)
      .json({ message: 'Error al eliminar el proveedor', error: err.message });
  }
};
