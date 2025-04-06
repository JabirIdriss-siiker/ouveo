const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  metrics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalArtisans: { type: Number, default: 0 },
    verifiedArtisans: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    platformFees: { type: Number, default: 0 }
  },
  userGrowth: [{
    date: Date,
    count: Number
  }],
  bookingStats: [{
    date: Date,
    count: Number,
    revenue: Number
  }],
  categoryPerformance: [{
    category: String,
    bookings: Number,
    revenue: Number
  }]
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);