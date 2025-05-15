const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  artisanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  clientName: {
    type: String,
    required: true
  },
  clientAddress: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'validated'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date
  },
  materials: [{
    name: String,
    quantity: Number,
    cost: Number
  }],
  workDetails: {
    problemDescription: String,
    solutionApplied: String,
    recommendations: String,
    timeSpent: Number
  },
  photos: [{
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  comments: [{
    text: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
  validationToken: {
    type: String,
    unique: true
  },
  validatedAt: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Mission", MissionSchema);