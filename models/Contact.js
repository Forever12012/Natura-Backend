const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  interest: {
    type: String,
    enum: ['general', 'wholesale', 'visit', 'order'],
    default: 'general'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
