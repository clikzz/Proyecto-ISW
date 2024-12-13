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
item_supp.id_item = 58
AND item_supp.is_deleted = FALSE
AND EXISTS (
    SELECT 1 
    FROM transaction t 
    JOIN transaction_item ti ON t.id_transaction = ti.id_transaction
    WHERE ti.id_item = 58
    AND ti.rut_supplier = item_supp.rut_supplier
    AND t.is_deleted = FALSE
)
ORDER BY
item_supp.purchase_date DESC;

DELETE FROM transaction_item;
DELETE FROM transaction WHERE transaction_type = 'compra' OR transaction_type = 'venta';
DELETE FROM item_supplier;
DELETE FROM item;

ALTER TABLE item
ALTER COLUMN selling_price TYPE INTEGER
USING FLOOR(selling_price::NUMERIC);

ALTER TABLE item_supplier
ALTER COLUMN purchase_price TYPE INTEGER
USING FLOOR(purchase_price::NUMERIC);

ALTER TABLE transaction_item
ALTER COLUMN subtotal TYPE INTEGER
USING FLOOR(subtotal::NUMERIC);

ALTER TABLE service
ALTER COLUMN price_service TYPE INTEGER
USING FLOOR(price_service::NUMERIC);

ALTER TABLE transaction
ALTER COLUMN amount TYPE INTEGER
USING FLOOR(amount::NUMERIC);