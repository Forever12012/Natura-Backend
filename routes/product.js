const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'natura_products',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const parser = multer({ storage });

// ==========================
// 📌 Upload Product
// ==========================
router.post('/upload', parser.single('image'), async (req, res) => {
  try {
    const { name, price, category, stock, status } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Name and price are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    const imageUrl = req.file.path;       // Cloudinary secure URL
    const publicId = req.file.filename;   // Cloudinary public_id

    const product = new Product({
      name,
      price,
      category,
      stock,
      status: status || 'Active',
      imageUrl,
      publicId
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product uploaded successfully!',
      data: product
    });

  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Server error, upload failed' });
  }
});

// ==========================
// 📌 Get All Products
// ==========================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// ==========================
// 📌 Update Product
// ==========================
router.put('/:id', parser.single('image'), async (req, res) => {
  try {
    const { name, price, category, stock, status } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // If new image is uploaded, replace old one
    if (req.file) {
      if (product.publicId) {
        await cloudinary.uploader.destroy(product.publicId);
      }
      product.imageUrl = req.file.path;
      product.publicId = req.file.filename;
    }

    // Update fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.status = status || product.status;

    await product.save();

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});



// ==========================
// 📌 Delete Product
// ==========================
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Remove image from Cloudinary (if exists)
    if (product.publicId) {
      await cloudinary.uploader.destroy(product.publicId);
    }

    // Remove product from DB
    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

module.exports = router;
