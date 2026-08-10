import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc  Create new order
// @route POST /api/orders
export const addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Recompute prices server-side from DB, never trust client totals
    let itemsPrice = 0;
    const preparedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      itemsPrice += product.price * item.qty;
      preparedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      });
      product.countInStock -= item.qty;
      await product.save();
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = new Order({
      user: req.user._id,
      orderItems: preparedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    next(err);
  }
};

// @desc  Get logged in user's orders
// @route GET /api/orders/myorders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc  Get order by id
// @route GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc  Mark order as paid
// @route PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Get all orders (admin)
// @route GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    if (order.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
