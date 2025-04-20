const Booking = require("../models/Booking");
const Service = require("../models/Service");
const moment = require("moment");
require("moment/locale/fr");

moment.locale("fr");

// Helper: Check if a time slot is available
const isTimeSlotAvailable = async (serviceId, bookingDate, startTime, endTime) => {
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  const existingBookings = await Booking.find({
    serviceId,
    bookingDate,
    status: { $in: ["en attente", "accepté"] },
    $or: [
      {
        $and: [
          { startTime: { $lte: start.format("HH:mm") } },
          { endTime: { $gt: start.format("HH:mm") } },
        ],
      },
      {
        $and: [
          { startTime: { $lt: end.format("HH:mm") } },
          { endTime: { $gte: end.format("HH:mm") } },
        ],
      },
      {
        $and: [
          { startTime: { $lte: start.format("HH:mm") } },
          { endTime: { $gte: end.format("HH:mm") } },
        ],
      },
    ],
  });

  return existingBookings.length === 0;
};

// Helper: Check if startTime is within service hours
const isWithinServiceHours = (service, bookingDate, startTime) => {
  const dayOfWeek = moment(bookingDate).format("dddd");
  const timeSlot = service.timeSlots.find(
    (slot) => slot.day.toLowerCase() === dayOfWeek.toLowerCase()
  );

  if (!timeSlot) return false;

  const start = moment(timeSlot.startTime, "HH:mm");
  const end = moment(timeSlot.endTime, "HH:mm");
  const requested = moment(startTime, "HH:mm");

  return requested.isBetween(start, end, null, "[]");
};

// Create a new booking
exports.createBooking = async (req, res) => {
  const { serviceId, artisanId, bookingDate, startTime, notes, customerName, customerPhone, customerEmail } = req.body;

  try {
    // Role check
    if (!["secretary", "artisan"].includes(req.user.role)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Validate required fields
    if (!serviceId || !artisanId || !bookingDate || !startTime || !customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis" });
    }

    // Fetch service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service non trouvé" });
    }

    // Validate date
    const bookingMoment = moment(bookingDate, "YYYY-MM-DD");
    if (bookingMoment.isBefore(moment(), "day")) {
      return res.status(400).json({ message: "La date de réservation doit être dans le futur" });
    }

    // Check service hours
    if (!isWithinServiceHours(service, bookingDate, startTime)) {
      return res.status(400).json({ message: "L'horaire choisi est en dehors des heures de service" });
    }

    // Calculate endTime
    const endTime = moment(startTime, "HH:mm")
      .add(service.duration + (service.bufferTime || 0), "minutes")
      .format("HH:mm");

    // Check availability
    const isAvailable = await isTimeSlotAvailable(serviceId, bookingDate, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ message: "Ce créneau horaire n'est pas disponible" });
    }

    // Create booking
    const booking = new Booking({
      customerName,
      customerPhone,
      customerEmail,
      artisanId,
      serviceId,
      bookingDate,
      startTime,
      endTime,
      notes: notes || "",
      status: "en attente",
      createdBy: req.user.id
    });

    await booking.save();
    res.status(201).json({
      message: "Réservation créée avec succès",
      booking,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    res.status(500).json({ message: "Erreur serveur lors de la création de la réservation" });
  }
};

// Get available time slots
exports.getAvailableTimeSlots = async (req, res) => {
  const { serviceId, date } = req.query;

  try {
    if (!serviceId || !date) {
      return res.status(400).json({ message: "ServiceId et date sont requis" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service non trouvé" });
    }

    const dayOfWeek = moment(date, "YYYY-MM-DD").format("dddd");
    const timeSlot = service.timeSlots.find(
      (slot) => slot.day.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!timeSlot) {
      return res.status(200).json({ availableSlots: [] });
    }

    const { startTime, endTime } = timeSlot;
    const { duration, bufferTime = 0 } = service;
    const slots = [];
    let current = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const end = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

    while (current.clone().add(duration + bufferTime, "minutes").isSameOrBefore(end)) {
      const slotStart = current.format("HH:mm");
      const slotEnd = current.clone().add(duration + bufferTime, "minutes").format("HH:mm");

      if (await isTimeSlotAvailable(serviceId, date, slotStart, slotEnd)) {
        slots.push(slotStart);
      }
      current.add(duration + bufferTime, "minutes");
    }

    res.status(200).json({ availableSlots: slots });
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get artisan's bookings
exports.getArtisanBookings = async (req, res) => {
  try {
    if (req.user.role !== "artisan") {
      return res.status(403).json({ message: "Accès réservé aux artisans" });
    }

    const bookings = await Booking.find({ artisanId: req.user.id })
      .populate("serviceId", "title price")
      .sort({ bookingDate: 1, startTime: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations artisan:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get all bookings (for secretaries)
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "secretary") {
      return res.status(403).json({ message: "Accès réservé aux secrétaires" });
    }

    const bookings = await Booking.find()
      .populate("serviceId", "title price")
      .populate("artisanId", "name")
      .sort({ bookingDate: 1, startTime: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;

  try {
    if (!["secretary", "artisan"].includes(req.user.role)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    if (!bookingId || !status) {
      return res.status(400).json({ message: "BookingId et status sont requis" });
    }

    const validStatuses = ["en attente", "accepté", "refusé", "terminé"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    if (req.user.role === "artisan" && booking.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette réservation" });
    }

    booking.status = status;
    await booking.save();

     // Auto-create mission if status is "accepté"
     if (status === "accepté") {
      const existingMission = await Mission.findOne({ bookingId });
      if (!existingMission) {
        const mission = new Mission({
          bookingId,
          title: booking.serviceId.title,
          description: booking.notes || "Mission pour " + booking.serviceId.title,
          artisanId: booking.artisanId._id,
          clientName: booking.customerName,
          clientAddress: booking.customerAddress || "",
          clientPhone: booking.customerPhone,
          startDate: booking.bookingDate,
          workDetails: {},
        });
        await mission.save();
      }
    }

    res.status(200).json({
      message: "Statut de la réservation mis à jour",
      booking,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    if (!["secretary", "artisan"].includes(req.user.role)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    if (req.user.role === "artisan" && booking.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette réservation" });
    }

    await Booking.deleteOne({ _id: booking._id });
    res.status(200).json({ message: "Réservation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};