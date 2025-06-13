const express = require('express');
const router = express.Router();

//products, inventory, purchases, sales, clients
const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/create-product', productController.createProduct);
router.put('/update-product/:id', productController.updateProduct);
router.delete('/delete-products/:id', productController.deleteProduct);

const inventoryController = require('../controllers/inventoryController');

router.get('/inventory', inventoryController.getInventory);
router.post('/create-inventory', inventoryController.createInventory);
router.put('/update-inventory/:idInventory', inventoryController.updateInventory);
router.delete('/delete-inventory/:idInventory', inventoryController.deleteInventory);

const purchaseController = require('../controllers/purchaseController');

router.get('/purchases', purchaseController.getAllPurchases);
router.post('/create-purchase', purchaseController.createPurchase);

const saleController = require('../controllers/saleController');

router.get('/sales', saleController.getAllSales);
router.post('/create-sale', saleController.createSale);


const clientController = require('../controllers/clientController');

router.get('/clients', clientController.getAllClients);
router.post('/create-client', clientController.createClient);
router.put('/update-client/:clientID', clientController.updateClient);
router.delete('/delete-client/:clientID', clientController.deleteClient);


module.exports = router;