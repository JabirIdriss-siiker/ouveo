const mongoose = require("mongoose");

const TimeSlotSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday"
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true }, // e.g., "17:00"
  breakStart: { type: String }, // Optional break time
  breakEnd: { type: String }
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, // In minutes
  timeSlots: [TimeSlotSchema], // Replace availability with structured time slots
  image: { type: String },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  maxClientsPerSlot: { type: Number, default: 1 }, // For group services
  bufferTime: { type: Number, default: 0 }, // Buffer time between bookings in minutes
});

module.exports = mongoose.model("Service", ServiceSchema);