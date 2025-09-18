const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  imageUrl: { type: String, required: true },
  publicId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);
