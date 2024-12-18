const Supplier = require('../models/Supplier');

const createSupplier = async (data) => await Supplier.create(data);
const softCreateSupplier = async (data) => await Supplier.softCreate(data);
const getAllSuppliers = async () => await Supplier.findAll();
const getSupplierById = async (id) => await Supplier.findById(id);
const updateSupplier = async (id, data) => await Supplier.update(id, data);
const deleteSupplier = async (id) => await Supplier.delete(id);
const getSupplierItems = async (id) => await Supplier.findItems(id);

module.exports = {
  createSupplier,
  softCreateSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierItems,
};
