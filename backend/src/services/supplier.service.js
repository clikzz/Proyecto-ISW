const Supplier = require('../models/Supplier');

const createSupplier = async (data) => await Supplier.create(data);
const getAllSuppliers = async () => await Supplier.findAll();
const getSupplierById = async (rut_supplier) => await Supplier.findById(rut_supplier);
const updateSupplier = async (rut_supplier, data) => await Supplier.update(rut_supplier, data);
const deleteSupplier = async (rut_supplier) => await Supplier.delete(rut_supplier);

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
