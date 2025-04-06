const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportedItem: {
    type: { type: String, enum: ["user", "service", "review", "booking"], required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  reason: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["pending", "resolved", "dismissed"], default: "pending" },
  moderatorNotes: { type: String },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model("Report", ReportSchema);