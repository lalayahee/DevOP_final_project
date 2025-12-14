const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/orders");

const USER_URL = process.env.USER_URL || 'http://localhost:3001';
const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:3002';

// POST /orders - Create order (validates user and product)
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId are required' });
    }

    // Validate user exists - call User Service
    let userResponse;
    try {
      userResponse = await axios.get(`${USER_URL}/users/${userId}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(500).json({ error: 'Failed to validate user' });
    }

    // Validate product exists - call Product Service
    let productResponse;
    try {
      productResponse = await axios.get(`${PRODUCT_URL}/products/${productId}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(500).json({ error: 'Failed to validate product' });
    }

    const product = productResponse.data;

    // Create order
    const order = await Order.create({
      userId,
      productId,
      productName: product.name,
      productPrice: product.price,
      timestamp: new Date()
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /orders/:id - Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
