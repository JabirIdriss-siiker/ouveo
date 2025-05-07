const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { 
  getServices, 
  addService, 
  deleteService, 
  getMyServices, 
  getServicesByArtisan,
  modifyMyService,
  getServiceById  // Ajout de 
  
} = require("../controllers/serviceController");

const upload = require("../middleware/upload"); // ou le chemin vers ton middleware


// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get("/", getServices);

// @route   GET /api/services/artisan/:id
// @desc    Get all services of a specific artisan
// @access  Public
router.get("/artisan/:id", getServicesByArtisan);
// Route pour obtenir un service par son ID

// @route   POST /api/services
// @desc    Add a new service
// @access  Private (Artisan only)
router.post("/", auth,upload.single("image"), addService);

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private (Artisan only)
router.delete("/:id", auth, deleteService);

// @route   GET /api/services/my-services
// @desc    Get artisan's own services
// @access  Private (Artisan only)
router.get("/my-services", auth, getMyServices);

router.put('/:id', auth,upload.single("image"), modifyMyService);

module.exports = router;
