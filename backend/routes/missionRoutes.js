const express = require("express");
const router = express.Router();
const multer = require("multer");
const { 
  createMission,
  getArtisanMissions,
  getMission,
  updateMission,
  updateMissionStatus,
  addPhoto,
  addComment,
  deletePhoto
} = require("../controllers/missionController");
const auth = require("../middleware/auth");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/booking/:bookingId", auth, createMission);
router.get("/artisan", auth, getArtisanMissions);
router.get("/:id", auth, getMission);
router.put("/:id", auth, updateMission);
router.put("/:id/status", auth, updateMissionStatus);
router.post("/:id/photos", auth, upload.single("photo"), addPhoto);
router.post("/:id/comments", auth, addComment);
router.delete("/:id/photos/:photoId", auth, deletePhoto);

module.exports = router;