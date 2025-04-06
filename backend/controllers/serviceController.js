const Service = require("../models/Service");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("artisanId", "name");
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const addService = async (req, res) => {
  // Log incoming request data
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const { title, price, description, category, duration, timeSlots, bufferTime } = req.body; // Include bufferTime
  const artisanId = req.user.id;

  try {
    // Validate required fields
    if (!title || !price || !description || !category || !duration || !timeSlots) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    let parsedTimeSlots = timeSlots;
    if (typeof timeSlots === "string") {
      try {
        parsedTimeSlots = JSON.parse(timeSlots);
      } catch (parseError) {
        console.error("Erreur lors du parsing des créneaux horaires:", parseError.message);
        return res.status(400).json({ message: "Format des créneaux horaires invalide" });
      }
    }

    // Validate that parsedTimeSlots is an array
    if (!Array.isArray(parsedTimeSlots)) {
      return res.status(400).json({ message: "Le format des créneaux horaires est invalide" });
    }

    const newService = new Service({
      title,
      price: Number(price),
      description,
      category,
      duration: Number(duration),
      timeSlots: parsedTimeSlots,
      artisanId,
      bufferTime: bufferTime ? Number(bufferTime) : 0, // Add bufferTime to the schema
    });

    if (req.file) {
      newService.image = `uploads/${req.file.filename}`;
    }

    const service = await newService.save();
    res.status(201).json(service);
  } catch (err) {
    console.error("Erreur lors de la création du service:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service non trouvé" });
    if (service.artisanId.toString() !== req.user.id)
      return res.status(401).json({ message: "Non autorisé" });
    
    // Delete the image file if it exists
    if (service.image) {
      const imagePath = path.join(__dirname, "..", service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Use deleteOne instead of remove
    await Service.deleteOne({ _id: service._id });
    res.json({ message: "Service supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ artisanId: req.user.id });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const getServicesByArtisan = async (req, res) => {
  try {
    const services = await Service.find({ artisanId: req.params.id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des services" });
  }
};

module.exports = { getServices, addService, deleteService, getMyServices, getServicesByArtisan };