const Portfolio = require("../models/Portfolio");
const fs = require("fs");
const path = require("path");

const getPortfolioByArtisan = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ artisanId: req.params.id });
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ artisanId: req.user.id });
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const addPortfolioItem = async (req, res) => {
  const { title, description } = req.body;
  const artisanId = req.user.id;

  try {
    const portfolioItem = new Portfolio({ title, description, artisanId });
    if (req.file) {
      portfolioItem.image = `uploads/${req.file.filename}`;
    }
    const savedItem = await portfolioItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const updatePortfolioItem = async (req, res) => {
  const { title, description } = req.body;
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Projet non trouvé" });
    if (item.artisanId.toString() !== req.user.id)
      return res.status(401).json({ message: "Non autorisé" });

    item.title = title || item.title;
    item.description = description || item.description;
    if (req.file) {
      if (item.image) fs.unlinkSync(path.join(__dirname, "..", item.image));
      item.image = `uploads/${req.file.filename}`;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

const deletePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Projet non trouvé" });
    if (item.artisanId.toString() !== req.user.id)
      return res.status(401).json({ message: "Non autorisé" });

    if (item.image) fs.unlinkSync(path.join(__dirname, "..", item.image));
    await item.remove();
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

module.exports = {
  getPortfolioByArtisan,
  getMyPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};