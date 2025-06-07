const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/create-product', productController.createProduct);
router.put('/update-product/:id', productController.updateProduct);
router.delete('/delete-products/:id', productController.deleteProduct);

const inventoryController = require('../controllers/inventoryController');

router.get('/inventory', inventoryController.getInventory);
router.post('/create-inventory', inventoryController.createInventory);
router.put('/update-inventory/:idInventory', inventoryController.updateInventory);
router.delete('/delete-inventory/:idInventory', inventoryController.deleteInventory);

module.exports = router;