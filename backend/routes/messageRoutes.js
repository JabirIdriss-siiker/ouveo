const express = require("express");
const router = express.Router();
const { createMessage, getMessages, updateMessageStatus } = require("../controllers/messageController");
const auth = require("../middleware/auth");

// Public route for creating messages
router.post("/", createMessage);

// Protected routes for admin/secretary
router.get("/", auth, getMessages);
router.put("/status", auth, updateMessageStatus);

module.exports = router;