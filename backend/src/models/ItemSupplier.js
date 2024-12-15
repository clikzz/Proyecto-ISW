const db = require ('../config/db');

class ItemSupplier {
  static async addItemSupplier(data) {
    const query = `
      INSERT INTO item_supplier (id_item, rut_supplier, purchase_price, purchase_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id_item, rut_supplier) 
      DO UPDATE SET
        purchase_price = EXCLUDED.purchase_price,
        purchase_date = EXCLUDED.purchase_date
      RETURNING *;
    `;
    const values = [data.id_item, data.rut_supplier, data.purchase_price, data.purchase_date || new Date()];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async removeSupplierFromItem(id_item, rut_supplier) {
    const query = `
      UPDATE item_supplier
      SET is_deleted = TRUE
      WHERE id_item = $1 AND rut_supplier = $2
      RETURNING *;
    `;
    const result = await db.query(query, [id_item, rut_supplier]);
    return result.rows[0];
  }

  static async findSuppliersByItem(id_item) {
    const query = `
      SELECT DISTINCT 
        s.*, 
        item_supp.purchase_price, 
        item_supp.purchase_date 
      FROM 
        item_supplier item_supp
      JOIN 
        supplier s 
      ON 
        item_supp.rut_supplier = s.rut_supplier
      WHERE 
        item_supp.id_item = $1 
        AND item_supp.is_deleted = FALSE
        AND EXISTS (
          SELECT 1 
          FROM transaction t 
          JOIN transaction_item ti ON t.id_transaction = ti.id_transaction
          WHERE ti.id_item = $1 
          AND ti.rut_supplier = item_supp.rut_supplier
          AND t.is_deleted = FALSE
        )
      ORDER BY
        item_supp.purchase_date DESC;
    `;
    const result = await db.query(query, [id_item]);
    return result.rows;
  }
  
  static async findItemsBySupplier(rut_supplier) {
    const query = `
      SELECT DISTINCT 
        i.id_item, 
        i.name_item, 
        item_supp.purchase_price, 
        item_supp.purchase_date
      FROM 
        item_supplier item_supp
      JOIN 
        item i ON item_supp.id_item = i.id_item
      WHERE 
        item_supp.rut_supplier = $1 AND item_supp.is_deleted = FALSE
      ORDER BY 
        item_supp.purchase_date DESC;
    `;
    const result = await db.query(query, [rut_supplier]);
    return result.rows;
  }  
}

module.exports = ItemSupplier;