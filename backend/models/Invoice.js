const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  missionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mission",
    required: true
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientAddress: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    amount: Number
  }],
  materials: [{
    name: String,
    quantity: Number,
    cost: Number,
    total: Number
  }],
  laborCost: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'cancelled'],
    default: 'draft'
  },
  dueDate: {
    type: Date,
    required: true
  },
  notes: String,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);