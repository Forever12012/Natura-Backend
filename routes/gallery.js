const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Gallery = require('../models/Gallery');

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
    folder: 'natura_gallery',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const parser = multer({ storage });

// ==========================
// 📌 Upload Gallery Image
// ==========================
router.post('/upload', parser.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    const imageUrl = req.file.path;       // Cloudinary secure URL
    const publicId = req.file.filename;   // Cloudinary public_id

    const gallery = new Gallery({
      title,
      description,
      imageUrl,
      publicId
    });

    await gallery.save();

    res.status(201).json({
      success: true,
      message: 'Gallery item uploaded successfully!',
      data: gallery
    });

  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Server error, upload failed' });
  }
});

// ==========================
// 📌 Get All Gallery Items
// ==========================
router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, data: gallery });
  } catch (err) {
    console.error('Get gallery error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch gallery' });
  }
});

// ==========================
// 📌 Update Gallery Item
// ==========================
router.put('/:id', parser.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }

    // If new image is uploaded, replace old one
    if (req.file) {
      if (gallery.publicId) {
        await cloudinary.uploader.destroy(gallery.publicId);
      }
      gallery.imageUrl = req.file.path;
      gallery.publicId = req.file.filename;
    }

    // Update fields
    gallery.title = title || gallery.title;
    gallery.description = description || gallery.description;

    await gallery.save();

    res.json({ success: true, message: 'Gallery item updated successfully', data: gallery });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update gallery item' });
  }
});

// ==========================
// 📌 Delete Gallery Item
// ==========================
router.delete('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }

    // Remove image from Cloudinary (if exists)
    if (gallery.publicId) {
      await cloudinary.uploader.destroy(gallery.publicId);
    }

    // Remove item from DB
    await gallery.deleteOne();

    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error('Delete gallery error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
  }
});

module.exports = router;
