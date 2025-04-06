import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import "moment/locale/fr";

moment.locale("fr");

const ServiceCard = ({ service }) => {
  const token = localStorage.getItem("token");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false); // New state for slot loading
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (bookingDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]); // Clear slots if no date is selected
      setSelectedTime(""); // Reset selected time
    }
  }, [bookingDate]);

  const fetchAvailableSlots = async () => {
    setFetchingSlots(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/available-slots?serviceId=${service._id}&date=${bookingDate}`,
        { headers: { "x-auth-token": token } }
      );
      const slots = response.data.availableSlots || [];
      console.log("Available slots:", slots); // Debug log
      setAvailableSlots(slots);
      if (slots.length > 0) {
        setSelectedTime(slots[0]); // Auto-select the first slot if available
      } else {
        setSelectedTime("");
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      toast.error("Erreur lors de la récupération des créneaux disponibles");
      setAvailableSlots([]);
      setSelectedTime("");
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!token) {
      toast.error("Veuillez vous connecter pour réserver");
      return;
    }
    if (!bookingDate || !selectedTime) {
      toast.error("Veuillez sélectionner une date et un horaire");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          serviceId: service._id,
          artisanId: service.artisanId?._id || service.artisanId,
          bookingDate,
          startTime: selectedTime,
          notes,
        },
        { headers: { "x-auth-token": token } }
      );
      toast.success("Réservation confirmée!");
      setBookingDate("");
      setSelectedTime("");
      setNotes("");
      setAvailableSlots([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setLoading(false);
    }
  };

  const artisanName =
    service.artisanId?.name ||
    (typeof service.artisanId === "string" ? "Artisan inconnu" : "Artisan inconnu");

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card-modern overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <img
          src={
            service.image
              ? `http://localhost:5000/${service.image}`
              : "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
          }
          alt={service.title}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
          <span className="text-2xl font-bold text-primary">{service.price}€</span>
        </div>

        <p className="text-primary mb-4">Description :</p>
           <p className="text-gray-600 mb-4">{service.description}</p>
           <br></br>

        <div className="flex items-center mb-6 space-x-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artisanName)}&background=random`}
            alt={artisanName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm text-gray-600">Par</p>
            <p className="font-medium text-primary-600">{artisanName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de réservation
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="input-modern"
              min={moment().format("YYYY-MM-DD")}
            />
          </div>

          {bookingDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horaire disponible
              </label>
              {fetchingSlots ? (
                <div className="flex items-center">
                  <ClipLoader size={20} color="#000000" />
                  <span className="ml-2 text-gray-600">Chargement des créneaux...</span>
                </div>
              ) : availableSlots.length > 0 ? (
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input-modern"
                >
                  <option value="">Sélectionnez un horaire</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500 text-sm">
                  Aucun créneau disponible pour cette date
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-modern"
              rows="3"
              placeholder="Ajoutez des détails sur votre demande..."
            />
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <ClockIcon className="w-5 h-5 mr-2" />
            <span>Durée: {service.duration} minutes</span>
          </div>

          <button
            onClick={handleBook}
            disabled={loading || !bookingDate || !selectedTime}
            className="btn-primary w-full flex justify-center items-center"
          >
            {loading ? (
              <ClipLoader size={20} color="#ffffff" />
            ) : (
              <>
                <CalendarIcon className="w-5 h-5 mr-2" />
                Réserver maintenant
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;