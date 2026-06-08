const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getAllProducts, getAllProductsAdmin, getAllProductsByCategory, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const router = express.Router();

router.get('/get-all-products', authMiddleware, getAllProducts);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllProductsAdmin);
router.get('/get-all-products-by-category/:categoryId', authMiddleware, getAllProductsByCategory);
router.get('/get-product/:id', authMiddleware, getProductById);
router.post('/create-product', authMiddleware, adminMiddleware, createProduct);
router.put('/update-product/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/delete-product/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;