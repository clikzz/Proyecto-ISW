const ItemSupplier = require('../models/ItemSupplier');

const addSupplierToItem = async (data) => {
  return await ItemSupplier.addItemSupplier(data);
};

const getSuppliersByItem = async (id_item) => {
  return await ItemSupplier.findSuppliersByItem(id_item);
};

const getItemsBySupplier = async (rut_supplier) => {
  return await ItemSupplier.findItemsBySupplier(rut_supplier);
};

module.exports = {
  addSupplierToItem,
  getSuppliersByItem,
  getItemsBySupplier,
};