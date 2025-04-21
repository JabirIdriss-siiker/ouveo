const express = require("express");
const {
  createBooking,
  getArtisanBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAvailableTimeSlots,
  rejectBooking,
  acceptBookingAndCreateMission
} = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, createBooking);
router.get("/available-slots", auth, getAvailableTimeSlots);
router.get("/artisan", auth, getArtisanBookings);
router.get("/all", auth, getAllBookings);
router.put("/status", auth, updateBookingStatus);
router.delete("/:id", auth, deleteBooking);
router.post("/:bookingId/reject", auth , rejectBooking);
router.post("/:bookingId/accept-and-create-mission", auth, acceptBookingAndCreateMission);

module.exports = router;