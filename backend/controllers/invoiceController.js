const Invoice = require("../models/Invoice");
const Mission = require("../models/Mission");

// Generate invoice number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year  = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `INV-${year}${month}-`;

  // 1) Trouver la facture du mois avec la séquence la plus élevée
  const latest = await Invoice
    .find({ invoiceNumber: { $regex: `^${prefix}\\d{4}$` } })
    .sort({ invoiceNumber: -1 })   // trie décroissant
    .limit(1)
    .lean();

  let nextSeq = 1;
  if (latest.length) {
    // on extrait la partie numérique après le dernier tiret
    const lastSeq = parseInt(latest[0].invoiceNumber.split('-')[2], 10);
    nextSeq = lastSeq + 1;
  }

  // 2) Formattage sur 4 chiffres
  const seqPadded = nextSeq.toString().padStart(4, '0');
  return `${prefix}${seqPadded}`;
};
// Create new invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      missionId,
      clientName,
      clientAddress,
      clientEmail,
      items = [],
      materials = [],
      laborCost = 0,
      notes = "",
      dueDate,
      artisanSiret,
      paymentMethod,
      paymentStatus
    } = req.body;

    // Add calculated totals to materials
    const materialsWithTotal = materials.map(item => ({
      ...item,
      total: item.cost * item.quantity
    }));

    const materialsTotal = materialsWithTotal.reduce((sum, item) => sum + item.total, 0);
    const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const subtotal = materialsTotal + itemsTotal + laborCost;
    const tax = subtotal * 0.20;
    const total = subtotal + tax;

    const invoice = new Invoice({
      invoiceNumber: await generateInvoiceNumber(),
      missionId,
      artisanId:   req.user.id, 
      clientName,
      clientAddress,
      clientEmail,
      items,
      materials: materialsWithTotal,
      laborCost,
      subtotal,
      tax,
      total,
      notes,
      dueDate,
      artisanSiret,
      ...(paymentMethod && { paymentMethod }),
      ...(paymentStatus && { paymentStatus })
      
    });

    await invoice.save();
    res.status(201).json(invoice);
    
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Erreur lors de la création de la facture" });
  }
  
};

// Get all invoices for artisan
exports.getArtisanInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ artisanId: req.user.id })
      .populate('missionId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('missionId')
      .populate('artisanId', 'name email')
      .populate({
       path: "missionId",
       populate: {
         path: "bookingId",
         select: "reason"           // on récupère au moins le champ reason
       }
     });
    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    if (invoice.artisanId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    if (invoice.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({ message: "Seuls les brouillons peuvent être modifiés" });
    }

    const {
      items,
      materials,
      laborCost,
      notes,
      dueDate,
      status
    } = req.body;

    // Recalculate totals
    const materialsTotal = materials.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const subtotal = materialsTotal + itemsTotal + laborCost;
    const tax = subtotal * 0.20; // 20% TVA
    const total = subtotal + tax;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        items,
        materials,
        laborCost,
        subtotal,
        tax,
        total,
        notes,
        dueDate,
        status,
        artisanSiret,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    if (invoice.artisanId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    invoice.status = status;
    invoice.updatedAt = Date.now();
    await invoice.save();

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    // Utilisez .equals() pour comparer un ObjectId à une string
    if (!invoice.artisanId.equals(req.user.id)) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({ message: "Seuls les brouillons peuvent être supprimés" });
    }

    await invoice.deleteOne();
    return res.json({ message: "Facture supprimée" });
  } catch (error) {
    
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};