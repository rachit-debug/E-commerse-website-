const express = require('express');
const { getAllCategories, getAllCategoriesAdmin, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const router = express.Router();

router.get('/get-all-categories', authMiddleware, getAllCategories);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllCategoriesAdmin);
router.get('/get-category/:id', authMiddleware, getCategoryById);
router.post('/create-category', authMiddleware, adminMiddleware, createCategory);
router.put('/update-category/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/delete-category/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;