const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');



// GET
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not find' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, price, category, image, description, stock, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Naam, price and category Required' });
    }

    const product = new Product({ name, price, category, image, description, stock, featured });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ error: 'Product nahi mila' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE 
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;