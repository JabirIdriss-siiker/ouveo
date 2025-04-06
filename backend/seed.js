const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Service = require("./models/Service");
const connectDB = require("./config/db"); // Import the function

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data (optional, comment out if you don’t want to reset)
    await User.deleteMany({});
    await Service.deleteMany({});

    // Create an artisan
    const artisanPassword = await bcrypt.hash("123456", 10);
    const artisan = new User({
      name: "Jean Dupont",
      email: "jean@example.com",
      password: artisanPassword,
      role: "artisan",
    });
    await artisan.save();
    console.log("Artisan créé:", artisan);

    // Create a service for the artisan
    const service = new Service({
      artisanId: artisan._id,
      title: "Réparation de fuite",
      price: 50,
      description: "Répare les fuites rapidement",
    });
    await service.save();
    console.log("Service créé:", service);

    // Create a client (optional)
    const clientPassword = await bcrypt.hash("123456", 10);
    const client = new User({
      name: "Marie Curie",
      email: "marie@example.com",
      password: clientPassword,
      role: "client",
    });
    await client.save();
    console.log("Client créé:", client);

    console.log("Base de données initialisée avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error.message);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

seedDatabase();