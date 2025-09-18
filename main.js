require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'natura_products', // folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const parser = multer({ storage: storage });

const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const galleryRoutes = require('./routes/gallery');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS (default: all origins, adjust as needed)
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gallery', galleryRoutes);


// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });
