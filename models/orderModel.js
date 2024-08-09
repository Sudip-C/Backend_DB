const mongoose = require('mongoose');

// Schema for Pending Orders
const pendingOrderSchema = new mongoose.Schema({
    buyer_qty: { type: Number, required: false },
    buyer_price: { type: Number, required: false },
    seller_price: { type: Number, required: false },
    seller_qty: { type: Number, required: false },
});

// Schema for Completed Orders
const completedOrderSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

const PendingOrder = mongoose.model('PendingOrder', pendingOrderSchema);
const CompletedOrder = mongoose.model('CompletedOrder', completedOrderSchema);

module.exports = { PendingOrder, CompletedOrder };
