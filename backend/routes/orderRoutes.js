const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const {
    getAllOrders,
    getMyOrders,
    checkoutCod,
    createRazorpayOrder,
    verifyRazorpayAndPlaceOrder,
    updateOrderStatus,
} = require('../controllers/order.controller');

const router = express.Router();

router.get('/my', authMiddleware, getMyOrders);
router.post('/checkout/cod', authMiddleware, checkoutCod);
router.post('/checkout/razorpay/create-order', authMiddleware, createRazorpayOrder);
router.post(
    '/checkout/razorpay/verify',
    authMiddleware,
    verifyRazorpayAndPlaceOrder
);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.patch(
    '/admin/:id/status',
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

module.exports = router;
