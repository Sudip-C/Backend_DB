const express = require('express');
const { getPendingOrders, getCompletedOrders, addOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/pending_orders', getPendingOrders);
router.get('/completed_orders', getCompletedOrders);
router.post('/orders', addOrder);

module.exports = router;
