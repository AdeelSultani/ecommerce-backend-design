const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET - Sare products
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product nahi mila' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Naya product add karo
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Product delete karo
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product delete ho gaya' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;