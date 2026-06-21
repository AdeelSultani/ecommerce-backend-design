const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/uploadimage'); 

// GET - All products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Featured
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

// POST - naya product, image ke saath
router.post('/', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description, stock, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Naam, price and category Required' });
    }

    // ✅ agar file aayi hai to uska path nikalo
    const imagePath = req.file ? `uploads/${req.file.filename}` : '';

    const product = new Product({
      name,
      price,
      category,
      image: imagePath,
      description,
      stock,
      featured
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - update, agar nayi image bheji to wo bhi update ho
router.put('/:id', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
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