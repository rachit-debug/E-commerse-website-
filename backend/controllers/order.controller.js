const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');

function getRazorpayClient() {
    const id = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!id || !secret) return null;
    return new Razorpay({ key_id: id, key_secret: secret });
}

async function resolveCartLines(itemsInput) {
    if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
        throw new Error('Cart is empty');
    }

    const lineItems = [];
    let totalAmount = 0;
    const updates = [];

    for (const row of itemsInput) {
        const productId = row.productId || row.product;
        const quantity = Number(row.quantity);
        if (!productId || Number.isNaN(quantity) || quantity < 1) {
            throw new Error('Invalid line item');
        }

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            throw new Error(`Product unavailable: ${productId}`);
        }
        if (product.stockQuantity < quantity) {
            throw new Error(`Not enough stock for ${product.title}`);
        }

        const unitPrice = product.sellingPrice;
        lineItems.push({
            product: product._id,
            title: product.title,
            quantity,
            unitPrice,
        });
        totalAmount += unitPrice * quantity;
        updates.push({ product, quantity });
    }

    return { lineItems, totalAmount, updates };
}

async function decrementStock(updates) {
    for (const { product, quantity } of updates) {
        product.stockQuantity -= quantity;
        await product.save();
    }
}

async function saveOrder(userId, payload) {
    const order = new Order(payload);
    await order.save();
    return order;
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('items.product', 'title images');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'title images');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.checkoutCod = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        const { lineItems, totalAmount, updates } = await resolveCartLines(
            items
        );

        await saveOrder(req.user.id, {
            user: req.user.id,
            items: lineItems,
            totalAmount,
            shippingAddress: shippingAddress || '',
            paymentMethod: 'cod',
            status: 'pending',
        });

        await decrementStock(updates);
        res.status(201).json({ message: 'Order placed' });
    } catch (err) {
        const msg = err.message || 'Checkout failed';
        res.status(400).json({ message: msg });
    }
};

exports.createRazorpayOrder = async (req, res) => {
    try {
        const rzp = getRazorpayClient();
        if (!rzp) {
            return res.status(503).json({
                message:
                    'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
            });
        }

        const { items } = req.body;
        const { totalAmount } = await resolveCartLines(items);
        if (totalAmount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const amountPaise = Math.round(totalAmount * 100);
        const receipt = `r_${req.user.id.toString().slice(-8)}_${Date.now()}`;

        const rpOrder = await rzp.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt,
            notes: {
                userId: String(req.user.id),
            },
        });

        res.status(200).json({
            orderId: rpOrder.id,
            amount: rpOrder.amount,
            currency: rpOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            totalAmount,
        });
    } catch (err) {
        const msg = err.message || 'Could not create payment order';
        res.status(400).json({ message: msg });
    }
};

exports.verifyRazorpayAndPlaceOrder = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(503).json({ message: 'Razorpay not configured' });
        }

        const {
            items,
            shippingAddress,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expected = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expected !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const rzp = getRazorpayClient();
        const rpOrder = await rzp.orders.fetch(razorpay_order_id);

        const { lineItems, totalAmount, updates } = await resolveCartLines(
            items
        );
        const expectedPaise = Math.round(totalAmount * 100);
        if (Number(rpOrder.amount) !== expectedPaise) {
            return res.status(400).json({ message: 'Amount mismatch' });
        }

        await saveOrder(req.user.id, {
            user: req.user.id,
            items: lineItems,
            totalAmount,
            shippingAddress: shippingAddress || '',
            paymentMethod: 'razorpay',
            razorpayPaymentId: razorpay_payment_id,
            status: 'processing',
        });

        await decrementStock(updates);
        res.status(201).json({ message: 'Order placed' });
    } catch (err) {
        const msg = err.message || 'Payment verification failed';
        res.status(400).json({ message: msg });
    }
};

const ORDER_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
];

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !ORDER_STATUSES.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        const updated = await Order.findById(id)
            .populate('user', 'name email')
            .populate('items.product', 'title images');

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
