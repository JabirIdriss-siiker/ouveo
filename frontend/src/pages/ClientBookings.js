// src/pages/ClientBookings.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient"; // Adjust path based on your structure

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get("/api/bookings/client");
          setBookings(response.data || []);
        } catch (error) {
          console.error("Erreur lors du chargement des réservations:", error);
          toast.error("Erreur lors du chargement des réservations");
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [token]);

  const handleCancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/bookings/${bookingId}`);
      setBookings(bookings.filter((b) => b._id !== bookingId));
      toast.success("Réservation annulée!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== "terminé");
  const pastBookings = bookings.filter((b) => b.status === "terminé");

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-8 font-anton text-dark">
      <div className="container mx-auto">
        <h2 className="section-title text-center">Mes réservations</h2>

        {/* Active Bookings */}
        <h3 className="text-lg sm:text-xl font-semibold text-dark mt-8 mb-4 text-center">
          Réservations actives
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <ClipLoader size={40} color="var(--primary)" />
          </div>
        ) : activeBookings.length > 0 ? (
          <div className="space-y-6">
            {activeBookings.map((booking) => (
              <div key={booking._id} className="card-modern p-4 sm:p-6">
                <p className="text-dark font-poppins">
                  <strong>Service:</strong> {booking.serviceId?.title || "Non spécifié"}
                </p>
                <p className="text-dark font-poppins">
                  <strong>Artisan:</strong> {booking.artisanId?.name || "Non spécifié"}
                </p>
                <p className="text-dark font-poppins">
                  <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-dark font-poppins">
                  <strong>Statut:</strong>
                  <span
                    className={`badge ml-2 ${
                      booking.status === "en attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
                {booking.status === "en attente" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn-primary mt-4 bg-red-500 hover:bg-red-600"
                  >
                    Annuler
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark/70 text-center font-poppins">Aucune réservation active.</p>
        )}

        {/* Past Bookings */}
        <h3 className="text-lg sm:text-xl font-semibold text-dark mt-12 mb-4 text-center">
          Réservations passées
        </h3>
        {pastBookings.length > 0 ? (
          <div className="space-y-6">
            {pastBookings.map((booking) => (
              <div key={booking._id} className="card-modern p-4 sm:p-6 opacity-75">
                <p className="text-dark font-poppins">
                  <strong>Service:</strong> {booking.serviceId?.title || "Non spécifié"}
                </p>
                <p className="text-dark font-poppins">
                  <strong>Artisan:</strong> {booking.artisanId?.name || "Non spécifié"}
                </p>
                <p className="text-dark font-poppins">
                  <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-dark font-poppins">
                  <strong>Statut:</strong>
                  <span className="badge ml-2 bg-blue-100 text-blue-800">{booking.status}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark/70 text-center font-poppins">Aucune réservation passée.</p>
        )}
      </div>
    </div>
  );
};

export default ClientBookings;