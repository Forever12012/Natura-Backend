require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS (default: all origins, adjust as needed)
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

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
