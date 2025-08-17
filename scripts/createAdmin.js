// scripts/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = "admin@naturaonline.in";
    const plainPassword = "TusharAdmin@login123";

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Upsert (create if not exists, otherwise update)
    const admin = await Admin.findOneAndUpdate(
      { username },
      { username, password: hashedPassword },
      { upsert: true, new: true }
    );

    console.log("✅ Admin created/updated:", admin);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    mongoose.disconnect();
  }
}

createAdmin();
