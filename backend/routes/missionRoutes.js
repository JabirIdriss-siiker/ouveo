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
  deletePhoto,
  getMissionByToken,
  validateMission
} = require("../controllers/missionController");
const auth = require("../middleware/auth");

const upload = require("../middleware/upload");

// Routes existantes avec auth
router.post("/booking/:bookingId", auth, createMission);
router.get("/artisan", auth, getArtisanMissions);
router.get("/:id", auth, getMission);
router.put("/:id", auth, updateMission);
router.put("/:id/status", auth, updateMissionStatus);
router.post("/:id/photos", auth, upload.single("photo"), addPhoto);
router.post("/:id/comments", auth, addComment);
router.delete("/:id/photos/:photoId", auth, deletePhoto);

// Nouvelles routes publiques pour la validation
router.get("/validate/:token", getMissionByToken);
router.post("/validate/:token", validateMission);

module.exports = router;