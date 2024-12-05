const itemSupplierService = require('../services/itemSupplier.service');

exports.addSupplierToItem = async (req, res) => {
  try {
    const { id_item, rut_supplier, purchase_price, purchase_date } = req.body;
    if (!id_item || !rut_supplier || !purchase_price) {
      return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    const result = await itemSupplierService.addSupplierToItem({
      id_item,
      rut_supplier,
      purchase_price,
      purchase_date,
    });

    res.status(201).json({ message: 'Proveedor asociado al ítem exitosamente.', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al asociar proveedor al ítem.', error: error.message });
  }
};

exports.getSuppliersByItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const suppliers = await itemSupplierService.getSuppliersByItem(id_item);
    res.status(200).json({ message: 'Proveedores obtenidos exitosamente.', data: suppliers });
  } catch (error) {
    console.error('Error al obtener proveedores:', error.message);
    res.status(500).json({ message: 'Error al obtener proveedores del ítem.', error: error.message });
  }
};

exports.getItemsBySupplier = async (req, res) => {
  try {
    const { rut_supplier } = req.params;
    const result = await itemSupplierService.getItemsBySupplier(rut_supplier);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ítems del proveedor.', error: error.message });
  }
};