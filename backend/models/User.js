const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["secretary", "artisan", "admin"], required: true },
  specialty: { type: String },
  location: { type: String },
  bio: { type: String },
  profilePicture: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  isVerified: { type: Boolean, default: false },
  verificationDocuments: [{
    type: { type: String },
    url: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  revenue: {
    total: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  artisanSiret : {type: String}

});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
