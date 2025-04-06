const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    user = new User({ name, email, password, role });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const payload = { user: { id: user.id, role: user.role, name: user.name, email: user.email } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const payload = { user: { id: user.id, role: user.role, name: user.name, email: user.email } };
    jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};
const fs = require("fs");
const path = require("path");

//get current user info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Update current user's info
const updateMe = async (req, res) => {
  const { name, email, password, specialty, location, bio } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (user.role === "artisan") {
      user.specialty = specialty || user.specialty;
      user.location = location || user.location;
      user.bio = bio || user.bio;
      if (req.file) {
        // Delete old image if it exists
        if (user.profilePicture) {
          fs.unlinkSync(path.join(__dirname, "..", user.profilePicture));
        }
        user.profilePicture = `uploads/${req.file.filename}`;
      }
    }

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty,
      location: user.location,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const getArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: "artisan" }).select("-password"); // Récupère les artisans sans leur mot de passe
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des artisans" });
  }
};
const getArtisanById = async (req, res) => {
  try {
    const artisanId = req.params.id; // Get the artisan's ID from the URL parameter

    // Find a specific artisan by their ID, excluding the password field
    const artisan = await User.findById(artisanId).select("-password");

    // If the artisan is not found, return a 404 error
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    // Return the artisan data
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement de l'artisan" });
  }
};

module.exports = { register, login, getMe, updateMe, getArtisans,getArtisanById };