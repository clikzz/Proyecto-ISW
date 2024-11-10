const db = require('../config/db');

class Inventory {
  static async createTransaction(type, items, details) {
    if (type === 'compra') {
      for (let item of items) {
        if (item.id_item === null && !details.rut_supplier) {
          throw new Error('Para la compra de un nuevo item, es necesario proporcionar el rut del proveedor.');
        }
      }
    }

    const transactionQuery = `
      INSERT INTO transaccion (rut, tipo, monto, fecha, metodo_pago, descripcion)
      VALUES ($1, $2, $3, NOW(), $4, $5)
      RETURNING id_transaccion;
    `;

    const transactionValues = [
      details.rut,
      type,
      details.monto,
      details.metodo_pago,
      details.descripcion,
    ];

    const result = await db.query(transactionQuery, transactionValues);
    const transactionId = result.rows[0].id_transaccion;

    for (let item of items) {
      if (type === 'venta') {
        // Disminuir el stock del item en ventas
        const updateStockQuery = `
          UPDATE item
          SET stock = stock - $1
          WHERE id_item = $2 AND stock >= $1;
        `;

        const updateResult = await db.query(updateStockQuery, [item.cantidad, item.id_item]);
        
        if (updateResult.rowCount === 0) {
          throw new Error(`Stock insuficiente para el item con ID ${item.id_item}`);
        }
      } else if (type === 'compra') {
        // Verificar si el item ya existe en caso de compra
        const itemExistsQuery = `
          SELECT id_item FROM item WHERE id_item = $1;
        `;
        const itemExistsResult = await db.query(itemExistsQuery, [item.id_item]);

        if (itemExistsResult.rowCount > 0) {
          // Si el item existe, actualizar el stock
          const updateStockQuery = `
            UPDATE item
            SET stock = stock + $1
            WHERE id_item = $2;
          `;
          await db.query(updateStockQuery, [item.cantidad, item.id_item]);
        } else {
          // Si el item no existe, verificar que se pase un `rut_supplier` válido
          if (!details.rut_supplier) {
            throw new Error(`Para la compra de un nuevo item, es necesario proporcionar el rut del proveedor.`);
          }

          // Crear el nuevo item
          const newItemQuery = `
            INSERT INTO item (rut_supplier, name_item, description, category, stock, cost_price, selling_price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING id_item;
          `;
          const newItemValues = [
            details.rut_supplier,
            item.name_item,
            item.description,
            item.category,
            item.cantidad,
            item.precio_unitario,
            item.selling_price
          ];
          const newItemResult = await db.query(newItemQuery, newItemValues);
          item.id_item = newItemResult.rows[0].id_item; // Actualizar `id_item` para usarlo en `transaction_item`
        }
      }

      // Insertar el detalle de la transacción en la tabla `transaction_item`
      const itemQuery = `
        INSERT INTO transaction_item (id_transaccion, id_item, cantidad_item, precio_unitario)
        VALUES ($1, $2, $3, $4);
      `;
      const itemValues = [
        transactionId,
        item.id_item,
        item.cantidad,
        item.precio_unitario,
      ];

      await db.query(itemQuery, itemValues);
    }

    return transactionId;
  }
}

module.exports = Inventory;