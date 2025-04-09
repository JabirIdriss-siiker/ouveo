// src/pages/Dashboardbookings.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar"; // Fixed typo and assumed path
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient"; // Adjust path based on your structure

const Dashboardbookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const token = localStorage.getItem("token");

  // Fetch bookings from the server
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/bookings/artisan");
      const sortedBookings = response.data.sort((a, b) =>
        new Date(b.bookingDate + " " + b.startTime) - new Date(a.bookingDate + " " + a.startTime)
      );
      setBookings(sortedBookings);
      applyFilters(sortedBookings, statusFilter, dateFilter);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchBookings();
    }
  }, [token]);

  // Apply filters whenever bookings or filter values change
  useEffect(() => {
    applyFilters(bookings, statusFilter, dateFilter);
  }, [bookings, statusFilter, dateFilter]);

  const applyFilters = (bookingsList, status, date) => {
    let filtered = [...bookingsList];
    if (status !== "all") {
      filtered = filtered.filter((b) => b.status === status);
    }
    if (date) {
      filtered = filtered.filter((b) =>
        new Date(b.bookingDate).toLocaleDateString("fr-FR") ===
        new Date(date).toLocaleDateString("fr-FR")
      );
    }
    setFilteredBookings(filtered);
  };

  // Update booking status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    setLoading(true);
    try {
      const response = await apiClient.put("/api/bookings/status", { bookingId, status: newStatus });
      const updatedBooking = response.data.booking;
      setBookings((prev) =>
        prev
          .map((b) => (b._id === bookingId ? updatedBooking : b))
          .sort((a, b) => new Date(b.bookingDate + " " + b.startTime) - new Date(a.bookingDate + " " + a.startTime))
      );
      toast.success(`Réservation ${newStatus === "accepté" ? "acceptée" : "terminée"} avec succès !`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Split bookings into new (en attente) and history (accepté, terminé)
  const newBookings = filteredBookings.filter((b) => b.status === "en attente");
  const historyBookings = filteredBookings.filter((b) => b.status !== "en attente");

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          {/* Header */}
          <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <h2 className="section-title text-center sm:text-left">Gestion des Réservations</h2>
            <button
              onClick={fetchBookings}
              className="btn-primary px-4 py-2 md:px-6 md:py-3"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="var(--light)" /> : "Rafraîchir"}
            </button>
          </motion.header>

          {/* Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6 md:mb-8 glass-card p-4 sm:p-6 flex flex-col sm:flex-row gap-4 md:gap-6"
          >
            <div className="form-group flex-1">
              <label className="form-label text-sm md:text-base">Filtrer par statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-modern w-full"
              >
                <option value="all">Tous</option>
                <option value="en attente">En attente</option>
                <option value="accepté">Accepté</option>
                <option value="terminé">Terminé</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="form-label text-sm md:text-base">Filtrer par date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-modern w-full"
              />
            </div>
          </motion.div>

          {/* Bookings List */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            {loading && !bookings.length ? (
              <div className="flex justify-center py-8 md:py-10">
                <ClipLoader size={40} color="var(--dark)" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center text-dark/70 py-8 md:py-10 text-sm md:text-base font-poppins">
                Aucune réservation trouvée pour ces critères
              </p>
            ) : (
              <div className="space-y-8 md:space-y-12">
                {/* New Reservations Section */}
                <div>
                  <h3 className="text-lg md:text-2xl font-semibold text-dark mb-4 md:mb-6">
                    Nouvelles Réservations
                  </h3>
                  {newBookings.length === 0 ? (
                    <p className="text-dark/70 text-sm md:text-base font-poppins">
                      Aucune nouvelle réservation
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {newBookings.map((booking, index) => (
                        <motion.div
                          key={booking._id}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeInUp}
                          transition={{ delay: index * 0.1 }}
                          className="card-modern hover-card p-4 sm:p-6"
                        >
                          <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div>
                              <h4 className="text-base sm:text-xl font-semibold text-dark">
                                {booking.serviceId?.title || "Service non trouvé"}
                              </h4>
                              <div className="text-dark/70 text-xs sm:text-sm space-y-1 md:space-y-2 font-poppins">
                                <p>Client: {booking.clientId?.name || "Inconnu"}</p>
                                <p>Date: {new Date(booking.bookingDate).toLocaleDateString("fr-FR")}</p>
                                <p>Horaire: {booking.startTime} - {booking.endTime}</p>
                              </div>
                            </div>
                            <span className="badge bg-primary/10 text-primary text-xs md:text-sm">
                              {booking.status}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-dark/70 text-xs sm:text-sm mb-3 md:mb-4 italic font-poppins">
                              Notes: {booking.notes}
                            </p>
                          )}
                          <div className="flex gap-2 md:gap-4">
                            <button
                              onClick={() => handleUpdateStatus(booking._id, "accepté")}
                              className="btn-primary flex-1 text-sm md:text-base"
                              disabled={loading}
                            >
                              {loading ? <ClipLoader size={20} color="var(--light)" /> : "Accepter"}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* History Section */}
                <div>
                  <h3 className="text-lg md:text-2xl font-semibold text-dark mb-4 md:mb-6">Historique</h3>
                  {historyBookings.length === 0 ? (
                    <p className="text-dark/70 text-sm md:text-base font-poppins">
                      Aucun historique disponible
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {historyBookings.map((booking, index) => (
                        <motion.div
                          key={booking._id}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeInUp}
                          transition={{ delay: index * 0.1 }}
                          className="card-modern hover-card p-4 sm:p-6"
                        >
                          <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div>
                              <h4 className="text-base sm:text-xl font-semibold text-dark">
                                {booking.serviceId?.title || "Service non trouvé"}
                              </h4>
                              <div className="text-dark/70 text-xs sm:text-sm space-y-1 md:space-y-2 font-poppins">
                                <p>Client: {booking.clientId?.name || "Inconnu"}</p>
                                <p>Date: {new Date(booking.bookingDate).toLocaleDateString("fr-FR")}</p>
                                <p>Horaire: {booking.startTime} - {booking.endTime}</p>
                              </div>
                            </div>
                            <span
                              className={`badge text-xs md:text-sm ${
                                booking.status === "accepté"
                                  ? "bg-primary-light text-dark"
                                  : "bg-dark-soft text-light"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-dark/70 text-xs sm:text-sm mb-3 md:mb-4 italic font-poppins">
                              Notes: {booking.notes}
                            </p>
                          )}
                          {booking.status === "accepté" && (
                            <div className="flex gap-2 md:gap-4">
                              <button
                                onClick={() => handleUpdateStatus(booking._id, "terminé")}
                                className="btn-primary flex-1 text-sm md:text-base"
                                disabled={loading}
                              >
                                {loading ? <ClipLoader size={20} color="var(--light)" /> : "Terminer"}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardbookings;