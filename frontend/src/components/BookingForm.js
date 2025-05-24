import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient";

const BookingForm = ({ service, onSuccess, initialData }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    if (initialData.name) setCustomerName(initialData.name);
    if (initialData.phone) setCustomerPhone(initialData.phone);
    if (initialData.address) setClientAddress(initialData.address);
    if (initialData.email) setCustomerEmail(initialData.email);
    if (initialData.reason) setReason(initialData.reason);

    if (initialData.preferredTime && !bookingDate) {
      const [date, time] = initialData.preferredTime.split(" ");
      setBookingDate(date);
      setSelectedTime(time);
      return;
    }

    if (bookingDate) {
      fetchAvailableSlots();
    }
  }, [initialData, bookingDate]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await apiClient.get(
        `/api/bookings/available-slots?serviceId=${service._id}&date=${bookingDate}`
      );
      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Erreur lors de la récupération des créneaux disponibles");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !customerName ||
      !customerPhone ||
      !customerEmail ||
      !clientAddress ||
      !bookingDate ||
      !selectedTime
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    const payload = {
      customerName,
      customerPhone,
      customerEmail,
      clientAddress,
      serviceId: service._id,
      artisanId: service.artisanId,
      bookingDate,
      startTime: selectedTime,
      reason,
      notes,
    };

    try {
      await apiClient.post("/api/bookings", payload);
      toast.success("Réservation créée avec succès !");
      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Erreur lors de la création de la réservation";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setClientAddress("");
    setBookingDate("");
    setSelectedTime("");
    setReason("");
    setNotes("");
    setAvailableSlots([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <input
          type="text"
          placeholder="Nom du client"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="input-modern"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="tel"
          placeholder="Téléphone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="input-modern"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="input-modern"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Adresse"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          className="input-modern"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="input-modern"
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      {bookingDate && (
        <div className="form-group">
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="input-modern"
            required
          >
            <option value="">Sélectionnez un horaire</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      )}

      {reason && (
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Motif du client</label>
          <textarea
            value={reason}
            readOnly
            className="input-modern bg-gray-100"
            rows="3"
          />
        </div>
      )}

      <div className="form-group">
        <textarea
          placeholder="Notes (optionnel)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-modern"
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex justify-center items-center"
      >
        {loading ? <ClipLoader size={20} color="#ffffff" /> : "Créer la réservation"}
      </button>
    </form>
  );
};

export default BookingForm;
