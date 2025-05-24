import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient";

// Grille des motifs par catégorie
const REASONS_BY_CATEGORY = {
  Serrurerie: [
    "Ouverture porte simple claquée",
    "Clé cassée dans la serrure",
    "Dégrippage de serrure",
    "Installation cylindre simple européen",
    "Installation serrure blindée 3 points",
  ],
  Plomberie: [
    "Débouchage canalisation",
    "Fuite d’eau",
    "Débouchage de WC",
    "Réparation chasse d’eau",
    "Recherche de fuite",
  ],
  // … ajoutez les autres catégories ici …
};

export default function BookingForm({ service, onSuccess, initialData }) {
  const [customerName, setCustomerName]   = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [bookingDate, setBookingDate]     = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime]     = useState("");
  const [category, setCategory]             = useState("");
  const [reason, setReason]                 = useState("");
  const [notes, setNotes]                   = useState("");
  const [loadingSlots, setLoadingSlots]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);

  // Pré-remplissage depuis initialData (secrétaire)
  useEffect(() => {
    if (!initialData) return;
    if (initialData.name)    setCustomerName(initialData.name);
    if (initialData.phone)   setCustomerPhone(initialData.phone);
    if (initialData.email)   setCustomerEmail(initialData.email);
    if (initialData.address) setClientAddress(initialData.address);
    if (initialData.reason) {
      const cat = Object.keys(REASONS_BY_CATEGORY)
        .find(c => REASONS_BY_CATEGORY[c].includes(initialData.reason));
      if (cat) setCategory(cat);
      setReason(initialData.reason);
    }
    if (initialData.preferredTime && !bookingDate) {
      const [d, t] = initialData.preferredTime.split(" ");
      setBookingDate(d);
      setSelectedTime(t);
    }
  }, [initialData, bookingDate]);

  // Récupération des créneaux dès que service+date sont définis
  useEffect(() => {
    if (!service || !bookingDate) return;
    setLoadingSlots(true);
    apiClient
      .get(`/api/bookings/available-slots?serviceId=${service._id}&date=${bookingDate}`)
      .then(r => setAvailableSlots(r.data.availableSlots || []))
      .catch(() => toast.error("Impossible de charger les créneaux"))
      .finally(() => setLoadingSlots(false));
  }, [service, bookingDate]);

  // Reset form
  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setClientAddress("");
    setBookingDate("");
    setAvailableSlots([]);
    setSelectedTime("");
    setCategory("");
    setReason("");
    setNotes("");
  };

  // Soumission
  const handleSubmit = async e => {
    e.preventDefault();
    if (
      !customerName || !customerPhone || !customerEmail ||
      !clientAddress || !bookingDate || !selectedTime ||
      !category || !reason
    ) {
      toast.error("Merci de remplir tous les champs obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/api/bookings", {
        serviceId:  service._id,
        artisanId:  service.artisanId,
        customerName,
        customerPhone,
        customerEmail,
        clientAddress,
        bookingDate,
        startTime:  selectedTime,
        category,
        reason,
        notes,
      });
      toast.success("RDV créé avec succès !");
      onSuccess?.();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du RDV");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Coordonnées client */}
      <input type="text" placeholder="Nom du client" value={customerName}
        onChange={e => setCustomerName(e.target.value)} className="input-modern" required />
      <input type="tel" placeholder="Téléphone" value={customerPhone}
        onChange={e => setCustomerPhone(e.target.value)} className="input-modern" required />
      <input type="email" placeholder="Email" value={customerEmail}
        onChange={e => setCustomerEmail(e.target.value)} className="input-modern" required />
      <input type="text" placeholder="Adresse" value={clientAddress}
        onChange={e => setClientAddress(e.target.value)} className="input-modern" required />

      {/* Date et créneaux */}
      <input type="date" value={bookingDate}
        onChange={e => setBookingDate(e.target.value)}
        className="input-modern" min={new Date().toISOString().split("T")[0]} required />
      {bookingDate && (
        loadingSlots
          ? <div className="flex justify-center"><ClipLoader /></div>
          : <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
            className="input-modern" required>
              <option value="">— Sélectionnez un créneau —</option>
              {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
      )}

      {/* Catégorie & Motif */}
      <select value={category} onChange={e => setCategory(e.target.value)}
        className="input-modern" required>
        <option value="">— Choisissez une catégorie —</option>
        {Object.keys(REASONS_BY_CATEGORY).map(cat =>
          <option key={cat} value={cat}>{cat}</option>
        )}
      </select>
      <select value={reason} onChange={e => setReason(e.target.value)}
        className="input-modern" disabled={!category} required>
        <option value="">— Sélectionnez un motif —</option>
        {category && REASONS_BY_CATEGORY[category].map(r =>
          <option key={r} value={r}>{r}</option>
        )}
      </select>

      {/* Notes et bouton */}
      <textarea placeholder="Notes (optionnel)" value={notes}
        onChange={e => setNotes(e.target.value)} className="input-modern" rows="3" />
      <button type="submit" disabled={submitting}
        className="btn-primary w-full flex justify-center">
        {submitting ? <ClipLoader size={20} color="#fff" /> : "Créer la réservation"}
      </button>
    </form>
  );
}
