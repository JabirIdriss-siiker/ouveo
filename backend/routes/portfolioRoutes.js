const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const {
  getPortfolioByArtisan,
  getMyPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} = require("../controllers/portfolioController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/artisan/:id", getPortfolioByArtisan);
router.get("/my-portfolio", auth, getMyPortfolio);
router.post("/", auth, upload.single("image"), addPortfolioItem);
router.put("/:id", auth, upload.single("image"), updatePortfolioItem);
router.delete("/:id", auth, deletePortfolioItem);

module.exports = router;