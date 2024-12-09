const itemService = require('../services/item.service');
const { createItem, updateItem } = require('../validations/item.validation');

exports.createItem = async (req, res) => {
  const { error } = createItem.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el item', error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los items', error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el item', error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  console.log('Datos recibidos para actualizar:', req.body);

  const { error } = updateItem.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const currentItem = await itemService.getItemById(req.params.id);
    if (!currentItem) return res.status(404).json({ message: 'Item no encontrado' });

    const updatedData = {
      rut_supplier: req.body.rut_supplier || currentItem.rut_supplier,
      name_item: req.body.name_item || currentItem.name_item,
      description: req.body.description || currentItem.description,
      category: req.body.category || currentItem.category,
      stock: req.body.stock !== undefined ? req.body.stock : currentItem.stock,
      selling_price: req.body.selling_price || currentItem.selling_price,
    };

    const updatedItem = await itemService.updateItem(req.params.id, updatedData);
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el item', error: err.message });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await itemService.deleteItem(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado correctamente', item: deletedItem });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el item', error: err.message });
  }
};
