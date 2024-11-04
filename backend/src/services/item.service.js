const Item = require('../models/Item');

const createItem = async (data) => await Item.create(data);
const getAllItems = async () => await Item.findAll();
const getItemById = async (id) => await Item.findById(id);
const updateItem = async (id, data) => await Item.update(id, data);
const deleteItem = async (id) => await Item.delete(id);

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};