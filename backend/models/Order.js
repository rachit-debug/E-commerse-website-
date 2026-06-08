const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        title: { type: String, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippingAddress: {
            type: String,
            trim: true,
            default: '',
        },
        paymentMethod: {
            type: String,
            enum: ['cod', 'razorpay'],
            default: 'cod',
        },
        razorpayPaymentId: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
