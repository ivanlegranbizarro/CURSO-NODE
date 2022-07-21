import express from 'express';
import Order from '../models/orders.js';
import OrderItem from '../models/order-item.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate('user', 'name')
      .populate('orderItems')
      .sort({ createdAt: -1 });
    res.status(200).send(orderList);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const orderItemsIds = req.body.orderItems.map((orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = newOrderItem.save();
      return newOrderItem._id;
    });

    let totalPrice = 0;
    for (let i = 0; i < orderItemsIds.length; i++) {
      const orderItem = await OrderItem.findById(orderItemsIds[i]);
      totalPrice += orderItem.quantity * orderItem.product.price;
    }

    const newOrder = new Order({
      ...req.body,
      orderItems: orderItemsIds,
      totalPrice,
    });

    newOrder = await newOrder.save();
    res.status(201).send(newOrder);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      })
      .sort({ createdAt: -1 });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      new: true,
    });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id/delete', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    await OrderItem.findByIdAndDelete(order.orderItems);
    res.status(204).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/total-sales', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    res.status(200).send({ totalSales: totalSales.pop().totalSales });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/total-orders', async (req, res) => {
  try {
    const totalOrders = await Order.count();
    res.status(200).send({ totalOrders });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const userOrderList = await Order.find({ user: req.params.id })
      .populate('user', 'name')
      .populate('orderItems')
      .sort({ createdAt: -1 });
    res.status(200).send(userOrderList);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
