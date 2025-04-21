const Message = require("../models/Message");

// Create new message
exports.createMessage = async (req, res) => {
  try {
    const { name, address, phone, serviceType, preferredTime, reason } = req.body;

    // Validate required fields
    if (!name || !address || !phone || !serviceType || !preferredTime || !reason) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const message = new Message({
      name,
      address,
      phone,
      serviceType,
      preferredTime,
      reason
    });

    await message.save();
    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création du message:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get all messages (for admin/secretary)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId, status } = req.body;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};