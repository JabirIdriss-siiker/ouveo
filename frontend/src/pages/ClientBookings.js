import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient"

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/bookings/client", { headers: { "x-auth-token": token } })
        .then((response) => {
          setBookings(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des réservations:", error);
          setLoading(false);
        });
    }
  }, [token]);

  const handleCancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { "x-auth-token": token },
      });
      setBookings(bookings.filter((b) => b._id !== bookingId));
      toast.success("Réservation annulée!");
    } catch (error) {
      toast.error("Erreur lors de l'annulation");
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== "terminé");
  const pastBookings = bookings.filter((b) => b.status === "terminé");

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-8">
      <div className="container mx-auto">
        <h2 className="section-title text-center">
          Mes réservations
        </h2>

        {/* Active Bookings */}
        <h3 className="text-lg sm:text-xl font-semibold text-dark mt-8 mb-4 text-center">
          Réservations actives
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <ClipLoader size={40} color="#f05742" />
          </div>
        ) : activeBookings.length > 0 ? (
          <div className="space-y-6">
            {activeBookings.map((booking) => (
              <div key={booking._id} className="card-modern p-4 sm:p-6">
                <p className="text-dark"><strong>Service:</strong> {booking.serviceId?.title}</p>
                <p className="text-dark"><strong>Artisan:</strong> {booking.artisanId?.name}</p>
                <p className="text-dark"><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString("fr-FR")}</p>
                <p className="text-dark"><strong>Statut:</strong> 
                  <span className={`badge ml-2 ${
                    booking.status === "en attente" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}>
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
          <p className="text-dark/70 text-center">Aucune réservation active.</p>
        )}

        {/* Past Bookings */}
        <h3 className="text-lg sm:text-xl font-semibold text-dark mt-12 mb-4 text-center">
          Réservations passées
        </h3>
        {pastBookings.length > 0 ? (
          <div className="space-y-6">
            {pastBookings.map((booking) => (
              <div key={booking._id} className="card-modern p-4 sm:p-6 opacity-75">
                <p className="text-dark"><strong>Service:</strong> {booking.serviceId?.title}</p>
                <p className="text-dark"><strong>Artisan:</strong> {booking.artisanId?.name}</p>
                <p className="text-dark"><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString("fr-FR")}</p>
                <p className="text-dark"><strong>Statut:</strong> 
                  <span className="badge ml-2 bg-blue-100 text-blue-800">
                    {booking.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark/70 text-center">Aucune réservation passée.</p>
        )}
      </div>
    </div>
  );
};

export default ClientBookings;