const express = require("express");
const {
  createBooking,
  getArtisanBookings,
  getClientBookings,
  updateBookingStatus,
  deleteBooking,
  getAvailableTimeSlots
} = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, createBooking);
router.get("/available-slots", auth, getAvailableTimeSlots);
router.get("/artisan", auth, getArtisanBookings);
router.get("/client", auth, getClientBookings);
router.put("/status", auth, updateBookingStatus);
router.delete("/:id", auth, deleteBooking);

module.exports = router;