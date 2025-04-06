const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
dotenv.config();
const app = express();
const multer = require("multer");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB
require("./config/db");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));