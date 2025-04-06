const User = require("../models/User");
const Analytics = require("../models/Analytics");
const Report = require("../models/Report");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

// User Management
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Artisan Verification
exports.getPendingVerifications = async (req, res) => {
  try {
    const artisans = await User.find({
      role: "artisan",
      isVerified: false,
      "verificationDocuments.status": "pending"
    }).select("-password");
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.verifyArtisan = async (req, res) => {
  try {
    const { artisanId, approved } = req.body;
    const status = approved ? "approved" : "rejected";
    
    const artisan = await User.findByIdAndUpdate(
      artisanId,
      {
        isVerified: approved,
        "verificationDocuments.$[].status": status
      },
      { new: true }
    ).select("-password");
    
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Analytics
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    const [
      totalUsers,
      totalArtisans,
      verifiedArtisans,
      totalBookings,
      completedBookings,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "artisan" }),
      User.countDocuments({ role: "artisan", isVerified: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "terminé" }),
      Booking.aggregate([
        { $match: { status: "terminé" } },
        { $lookup: { from: "services", localField: "serviceId", foreignField: "_id", as: "service" } },
        { $unwind: "$service" },
        { $group: { _id: null, total: { $sum: "$service.price" } } }
      ])
    ]);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const analytics = new Analytics({
      metrics: {
        totalUsers,
        totalArtisans,
        verifiedArtisans,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        platformFees: (totalRevenue[0]?.total || 0) * 0.1 // 10% platform fee
      },
      userGrowth: userGrowth.map(item => ({
        date: new Date(item._id),
        count: item.count
      }))
    });

    await analytics.save();
    res.json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Content Moderation
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "name email")
      .populate("resolvedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.handleReport = async (req, res) => {
  try {
    const { reportId, status, moderatorNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        moderatorNotes,
        resolvedBy: req.user.id,
        resolvedAt: new Date()
      },
      { new: true }
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Revenue Tracking
exports.getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: "terminé" };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const revenue = await Booking.aggregate([
      { $match: query },
      { $lookup: { from: "services", localField: "serviceId", foreignField: "_id", as: "service" } },
      { $unwind: "$service" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalRevenue: { $sum: "$service.price" },
          bookingsCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};