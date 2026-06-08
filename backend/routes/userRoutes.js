const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { getUserById, getUserByEmail, getAllUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const adminMiddleware = require('../middlewares/admin.middleware');
const router = express.Router();

router.get('/get-user-by-id', authMiddleware, getUserById)
router.get('/get-user-by-email', authMiddleware, getUserByEmail)
router.get('/get-all-users', authMiddleware, adminMiddleware, getAllUsers)
router.put('/update-user', authMiddleware, updateUser)
router.delete('/delete-user', authMiddleware, deleteUser)

module.exports = router;