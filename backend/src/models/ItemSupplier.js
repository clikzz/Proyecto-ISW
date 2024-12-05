const db = require ('../config/db');

class ItemSupplier {
  static async addItemSupplier(data) {
    const query = `
      INSERT INTO item_supplier (id_item, rut_supplier, purchase_price, purchase_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [data.id_item, data.rut_supplier, data.purchase_price, data.purchase_date || new Date()];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findSuppliersByItem(id_item) {
    const query = `
      SELECT 
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
      ORDER BY
        item_supp.purchase_date DESC;
    `;
    const result = await db.query(query, [id_item]);
    return result.rows;
  }
  
  static async findItemsBySupplier(rut_supplier) {
    const query = `
      SELECT 
        i.id_item, 
        i.name_item, 
        item_supp.purchase_price, 
        item_supp.purchase_date
      FROM 
        item_supplier item_supp
      JOIN 
        item i ON item_supp.id_item = i.id_item
      WHERE 
        item_supp.rut_supplier = $1
      ORDER BY 
        item_supp.purchase_date DESC;
    `;
    const result = await db.query(query, [rut_supplier]);
    return result.rows;
  }  
}

module.exports = ItemSupplier;