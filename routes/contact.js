const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, interest } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newContact = new Contact({ name, email, phone, message, interest });
    await newContact.save();

    res.status(201).json({ message: 'Contact form submitted successfully.' });
  } catch (err) {
    console.error('[Contact POST]', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('[Contact GET]', err);
    res.status(500).json({ error: 'Server error while fetching contacts.' });
  }
});


module.exports = router;
