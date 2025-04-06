const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Apply both auth and adminAuth middleware to all routes
router.use(auth);
router.use(adminAuth);

// User Management
router.get("/users", adminController.getUsers);
router.put("/users/status", adminController.updateUserStatus);

// Artisan Verification
router.get("/verifications", adminController.getPendingVerifications);
router.post("/verify-artisan", adminController.verifyArtisan);

// Analytics
router.get("/dashboard-stats", adminController.getDashboardStats);

// Content Moderation
router.get("/reports", adminController.getReports);
router.put("/reports", adminController.handleReport);

// Revenue Tracking
router.get("/revenue", adminController.getRevenueStats);

module.exports = router;