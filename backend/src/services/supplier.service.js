const Supplier = require('../models/Supplier');

const createSupplier = async (data) => await Supplier.create(data);
const getAllSuppliers = async () => await Supplier.findAll();
const getSupplierById = async (id) => await Supplier.findById(id);
const updateSupplier = async (id, data) => await Supplier.update(id, data);

const deleteSupplier = async (id) => {
  const deletedSupplier = await Supplier.delete(id);
  if (!deletedSupplier) {
    throw new Error('Proveedor no encontrado o ya eliminado');
  }
  return deletedSupplier;
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
