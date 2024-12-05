const db = require('../config/db');
const ItemSupplier = require('./ItemSupplier');

class Item {
  static async create(data) {
    const query = `
      INSERT INTO item (rut_supplier, name_item, description, category, stock, selling_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      data.rut_supplier, data.name_item, data.description, data.category,
      data.stock, data.selling_price,
    ];
    const result = await db.query(query, values);

    if (data.rut_supplier) {
      await ItemSupplier.addItemSupplier({
        id_item: result.rows[0].id_item,
        rut_supplier: data.rut_supplier,
        purchase_price: data.purchase_price || 0,
        purchase_date: new Date(),
      });
    }

    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT 
        i.id_item,
        i.name_item,
        i.description,
        i.category,
        i.stock,
        i.selling_price,
        i.created_at,
        i.updated_at,
        i.is_deleted,
        ARRAY_AGG(s.name_supplier) AS suppliers
      FROM 
        item i
      LEFT JOIN 
        item_supplier isup ON i.id_item = isup.id_item
      LEFT JOIN 
        supplier s ON isup.rut_supplier = s.rut_supplier
      WHERE 
        i.is_deleted = FALSE
      GROUP BY 
        i.id_item
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        i.*, 
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'rut_supplier', s.rut_supplier,
            'name_supplier', s.name_supplier,
            'purchase_price', isup.purchase_price,
            'purchase_date', isup.purchase_date
          )
        ) AS suppliers
      FROM 
        item i
      LEFT JOIN 
        item_supplier isup ON i.id_item = isup.id_item
      LEFT JOIN 
        supplier s ON isup.rut_supplier = s.rut_supplier
      WHERE 
        i.id_item = $1 AND i.is_deleted = FALSE
      GROUP BY 
        i.id_item;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = `
      SELECT * FROM item
      WHERE name_item ILIKE $1 AND is_deleted = FALSE;
    `;
    const result = await db.query(query, [name]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE item
      SET rut_supplier = $1, name_item = $2, description = $3, category = $4,
          stock = $5, selling_price = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id_item = $7 AND is_deleted = FALSE
      RETURNING *;
    `;
    const values = [
      data.rut_supplier, data.name_item, data.description, data.category,
      data.stock, data.cost_price, data.selling_price, id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateStock(id, quantity, operation) {
    const query = `
      UPDATE item
      SET stock = stock ${operation === 'add' ? '+' : '-'} $1, updated_at = CURRENT_TIMESTAMP
      WHERE id_item = $2 AND is_deleted = FALSE
      RETURNING *;
    `;
    const result = await db.query(query, [quantity, id]);
    if (result.rowCount === 0) {
      throw new Error(`Stock insuficiente o ítem no encontrado para el ID ${id}`);
    }
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      UPDATE item 
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id_item = $1 AND is_deleted = FALSE
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Item;
