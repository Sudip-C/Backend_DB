const { PendingOrder, CompletedOrder } = require('../models/orderModel');

const getPendingOrders = async (req, res) => {
    try {
        const orders = await PendingOrder.find();
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const getCompletedOrders = async (req, res) => {
    try {
        const orders = await CompletedOrder.find();
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const addOrder = async (req, res) => {
    const { buyerQty, buyerPrice, sellerPrice, sellerQty, isBuyer } = req.body;

    try {
        if (isBuyer) {
            let orders = await PendingOrder.find({ seller_price: { $lte: buyerPrice } });
            let qty = buyerQty;

            for (let order of orders) {
                if (qty === 0) break;

                const matchedQty = Math.min(qty, order.seller_qty);

                await CompletedOrder.create({
                    price: order.seller_price,
                    qty: matchedQty
                });

                if (matchedQty < order.seller_qty) {
                    order.seller_qty -= matchedQty;
                    await order.save();
                } else {
                    await PendingOrder.findByIdAndDelete(order._id);
                }

                qty -= matchedQty;
            }

            if (qty > 0) {
                await PendingOrder.create({
                    buyer_qty: qty,
                    buyer_price: buyerPrice
                });
            }

            res.send('Order matched and pending order updated');
        } else {
            let orders = await PendingOrder.find({ buyer_price: { $gte: sellerPrice } });
            let qty = sellerQty;

            for (let order of orders) {
                if (qty === 0) break;

                const matchedQty = Math.min(qty, order.buyer_qty);

                await CompletedOrder.create({
                    price: order.buyer_price,
                    qty: matchedQty
                });

                if (matchedQty < order.buyer_qty) {
                    order.buyer_qty -= matchedQty;
                    await order.save();
                } else {
                    await PendingOrder.findByIdAndDelete(order._id);
                }

                qty -= matchedQty;
            }

            if (qty > 0) {
                await PendingOrder.create({
                    seller_qty: qty,
                    seller_price: sellerPrice
                });
            }

            res.send('Order matched and pending order updated');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getPendingOrders,
    getCompletedOrders,
    addOrder
};
