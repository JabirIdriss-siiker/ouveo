const express = require("express");
const { register, login, getMe, updateMe,getArtisans,getArtisanById } = require("../controllers/authController");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });
  const upload = multer({ storage });
  
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/me", auth, upload.single("profilePicture"), updateMe);

// @route   GET /api/auth/artisans
// @desc    Get all users with role "artisan"
// @access  Public
router.get("/artisans", getArtisans);
// @route   GET /api/auth/artisans
// @desc    Get all users with role "artisan"
// @access  Public
router.get("/artisans/:id", getArtisanById);
module.exports = router;