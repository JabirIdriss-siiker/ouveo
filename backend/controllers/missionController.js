const Mission = require("../models/Mission");
const Booking = require("../models/Booking");
const fs = require("fs");
const path = require("path");

// Create mission from booking
exports.createMission = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { title, description, workDetails } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("serviceId")
      .populate("artisanId");

    if (!booking) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    if (booking.status !== "accepté") {
      return res.status(400).json({ message: "La réservation doit être acceptée pour créer une mission" });
    }

    if (booking.artisanId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const mission = new Mission({
      bookingId,
      title: title || booking.serviceId.title,
      description: description || booking.notes || "Mission pour " + booking.serviceId.title,
      artisanId: booking.artisanId._id,
      clientName: booking.customerName,
      clientAddress: booking.customerAddress || "",
      clientPhone: booking.customerPhone,
      startDate: booking.bookingDate,
      workDetails: workDetails || {},
    });

    await mission.save();
    res.status(201).json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get all missions for an artisan
exports.getArtisanMissions = async (req, res) => {
  try {
    const missions = await Mission.find({
      artisanId: req.user.id,
    })
      .populate({
        path: "bookingId",
        match: { status: "accepté" },
      })
      .sort({ createdAt: -1 });

    const filteredMissions = missions.filter((mission) => mission.bookingId !== null);

    res.json(filteredMissions);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get a single mission
exports.getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate({
        path: "bookingId",
        match: { status: "accepté" },
      })
      .populate("comments.createdBy", "name");

    if (!mission || !mission.bookingId) {
      return res.status(404).json({ message: "Mission non trouvée ou réservation non acceptée" });
    }

    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update mission details
exports.updateMission = async (req, res) => {
  try {
    const { workDetails, materials } = req.body;
    const mission = await Mission.findById(req.params.id).populate("bookingId");

    if (!mission || mission.bookingId.status !== "accepté") {
      return res.status(404).json({ message: "Mission non trouvée ou réservation non acceptée" });
    }

    if (mission.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (workDetails) mission.workDetails = workDetails;
    if (materials) mission.materials = materials;

    await mission.save();
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update mission status
exports.updateMissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const mission = await Mission.findById(req.params.id).populate("bookingId");

    if (!mission || mission.bookingId.status !== "accepté") {
      return res.status(404).json({ message: "Mission non trouvée ou réservation non acceptée" });
    }

    if (mission.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    mission.status = status;
    if (status === "completed") {
      mission.completionDate = new Date();
    }

    await mission.save();
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Add photo to mission
exports.addPhoto = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate("bookingId");

    if (!mission || mission.bookingId.status !== "accepté") {
      return res.status(404).json({ message: "Mission non trouvée ou réservation non acceptée" });
    }

    if (mission.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Aucune photo fournie" });
    }
    
    const photo = {
      url: `uploads/${req.file.filename}`,
      description: req.body.description || "",
      uploadedAt: new Date()
    };
    
    
    mission.photos.push(photo);
    await mission.save();
    res.json(mission);
  } catch (error) {
    console.error("Error adding photo:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Add comment to mission
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const mission = await Mission.findById(req.params.id).populate("bookingId");

    if (!mission || mission.bookingId.status !== "accepté") {
      return res.status(404).json({ message: "Mission non trouvée ou réservation non acceptée" });
    }

    const comment = {
      text,
      createdBy: req.user.id,
    };

    mission.comments.push(comment);
    await mission.save();

    const populatedMission = await Mission.findById(mission._id)
      .populate("comments.createdBy", "name");

    res.json(populatedMission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Delete photo from mission
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const mission = await Mission.findById(req.params.id).populate("bookingId");

    if (!mission || mission.bookingId.status !== "accepté") {
      return res.status(404).json({ message: "Mission non trouvée ou réservation non acceptée" });
    }

    if (mission.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const photo = mission.photos.id(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo non trouvée" });
    }

    if (photo.url) {
      const filePath = path.join(__dirname, "..", photo.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    mission.photos.pull(photoId);
    await mission.save();
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};