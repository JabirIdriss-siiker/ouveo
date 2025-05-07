const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createInvoice,
  getArtisanInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice
} = require("../controllers/invoiceController");

router.post("/", auth, createInvoice);
router.get("/artisan", auth, getArtisanInvoices);
router.get("/:id", auth, getInvoice);
router.put("/:id", auth, updateInvoice);
router.put("/:id/status", auth, updateInvoiceStatus);
router.delete("/:id", auth, deleteInvoice);

module.exports = router;