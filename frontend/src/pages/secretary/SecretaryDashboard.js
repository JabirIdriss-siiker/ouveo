import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BookingForm from "../../components/BookingForm";
import apiClient from "../../api/apiClient";
import SecretarySideBar from "../../components/secretary/SecretraySidebar";
import { FaCalendarCheck, FaUserClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SecretaryDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get all services first
      const servicesRes = await apiClient.get("/api/services");
      setServices(servicesRes.data || []);

      // Get all bookings with populated service and artisan info
      const bookingsRes = await apiClient.get("/api/bookings/all");
      const bookingsData = bookingsRes.data || [];

      // Update bookings state
      setBookings(bookingsData);
      
      // Calculate stats
      setStats({
        total: bookingsData.length,
        pending: bookingsData.filter(b => b.status === "en attente").length,
        completed: bookingsData.filter(b => b.status === "terminé").length,
        cancelled: bookingsData.filter(b => b.status === "annulé").length
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await apiClient.put("/api/bookings/status", { bookingId, status: newStatus });
      fetchData();
      toast.success("Statut mis à jour avec succès");
      setShowEventDetails(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;
    
    try {
      await apiClient.delete(`/api/bookings/${bookingId}`);
      fetchData();
      toast.success("Réservation supprimée avec succès");
      setShowEventDetails(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const calendarEvents = bookings.map((booking) => {
  // 1) on crée un Date uniquement à partir de bookingDate
  const start = new Date(booking.bookingDate);
  // 2) on parse HH:mm et on fixe l’heure / minute
  const [hStart, mStart] = booking.startTime.split(":").map(Number);
  start.setHours(hStart, mStart);

  // même pour endTime
  const end = new Date(booking.bookingDate);
  const [hEnd, mEnd] = booking.endTime.split(":").map(Number);
  end.setHours(hEnd, mEnd);

  return {
    id: booking._id,
    title: `${booking.customerName} – ${booking.serviceId?.title}`,
    start,
    end,
    resource: booking,
  };
});

  const handleEventClick = (event) => {
    setSelectedEvent(event.resource);
    setShowEventDetails(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <SecretarySideBar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Tableau de bord secrétaire</h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="btn-primary"
              >
                Nouvelle réservation
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card-modern p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark/70">Total Réservations</p>
                    <h3 className="text-2xl font-bold">{stats.total}</h3>
                  </div>
                  <FaCalendarCheck className="text-2xl text-primary" />
                </div>
              </div>
              <div className="card-modern p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark/70">En Attente</p>
                    <h3 className="text-2xl font-bold">{stats.pending}</h3>
                  </div>
                  <FaUserClock className="text-2xl text-yellow-500" />
                </div>
              </div>
              <div className="card-modern p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark/70">Terminées</p>
                    <h3 className="text-2xl font-bold">{stats.completed}</h3>
                  </div>
                  <FaCheckCircle className="text-2xl text-green-500" />
                </div>
              </div>
              <div className="card-modern p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark/70">Annulées</p>
                    <h3 className="text-2xl font-bold">{stats.cancelled}</h3>
                  </div>
                  <FaTimesCircle className="text-2xl text-red-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="card-modern p-6"
            >
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleEventClick}
                messages={{
                  next: "Suivant",
                  previous: "Précédent",
                  today: "Aujourd'hui",
                  month: "Mois",
                  week: "Semaine",
                  day: "Jour",
                }}
                eventPropGetter={(event) => ({
                  className: `status-${event.resource.status}`,
                  style: {
                    backgroundColor: 
                      event.resource.status === "en attente" ? "#fbbf24" :
                      event.resource.status === "terminé" ? "#22c55e" :
                      event.resource.status === "annulé" ? "#ef4444" :
                      "#3b82f6",
                    color: "white",
                  }
                })}
              />
            </motion.div>
          )}

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Nouvelle réservation</h2>
                <div className="mb-4">
                  <select
                    className="input-modern w-full"
                    value={selectedService?._id || ""}
                    onChange={(e) => setSelectedService(services.find(s => s._id === e.target.value))}
                  >
                    <option value="">Sélectionnez un service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.title} - {service.artisanId?.name || "Artisan inconnu"}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedService && (
                  <BookingForm
                    service={selectedService}
                    onSuccess={() => {
                      setShowBookingForm(false);
                      fetchData();
                    }}
                  />
                )}
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="btn-secondary w-full mt-4"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Event Details Modal */}
          {showEventDetails && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Détails de la réservation</h2>
                <div className="space-y-2 mb-4">
                  <p><strong>Client:</strong> {selectedEvent.customerName}</p>
                  <p><strong>Service:</strong> {selectedEvent.serviceId?.title}</p>
                  <p><strong>Artisan:</strong> {selectedEvent.artisanId?.name}</p>
                  <p><strong>Date:</strong> {new Date(selectedEvent.bookingDate).toLocaleDateString()}</p>
                  <p><strong>Horaire:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  <p><strong>Statut:</strong> {selectedEvent.status}</p>
                  <p><strong>Téléphone:</strong> {selectedEvent.customerPhone}</p>
                  <p><strong>Email:</strong> {selectedEvent.customerEmail}</p>
                  {selectedEvent.notes && <p><strong>Notes:</strong> {selectedEvent.notes}</p>}
                </div>
                <div className="space-y-2">
                  <select
                    className="input-modern w-full mb-2"
                    value={selectedEvent.status}
                    onChange={(e) => handleUpdateStatus(selectedEvent._id, e.target.value)}
                  >
                    <option value="en attente">En attente</option>
                    <option value="accepté">Accepté</option>
                    <option value="terminé">Terminé</option>
                    <option value="annulé">Annulé</option>
                  </select>
                  <button
                    onClick={() => handleDeleteBooking(selectedEvent._id)}
                    className="btn-primary bg-red-500 hover:bg-red-600 w-full"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="btn-secondary w-full"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;