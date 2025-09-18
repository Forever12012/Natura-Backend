const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String },
  stock: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
});


module.exports = mongoose.model('Product', ProductSchema);
