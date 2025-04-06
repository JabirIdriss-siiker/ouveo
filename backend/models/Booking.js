const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  status: { type: String, enum: ["en attente", "accepté", "terminé", "annulé"], default: "en attente" },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // Store time as "HH:mm"
  endTime: { type: String, required: true }, // Calculated based on service duration
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Index for efficient booking conflict checks
bookingSchema.index({ serviceId: 1, bookingDate: 1, startTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);