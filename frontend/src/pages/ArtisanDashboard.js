// src/pages/ArtisanDashboard.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  FaUsers,
  FaTools,
  FaCalendarCheck,
  FaEuroSign
} from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient";

// Calendrier
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const ArtisanDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });

      const fetchData = async () => {
        try {
          const [bookingsRes, servicesRes] = await Promise.all([
            apiClient.get("/api/bookings/artisan"),
            apiClient.get("/api/services/my-services")
          ]);
          setBookings(bookingsRes.data || []);
          setServices(servicesRes.data || []);
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
        }
      };
      fetchData();
    }
  }, [token]);

  const totalRevenue = bookings
    .filter(b => b.status === "terminé")
    .reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);

  const completedBookings = bookings.filter(b => b.status === "terminé").length;
  const pendingBookings = bookings.filter(b => b.status === "en attente").length;

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const count = bookings.filter(
      b => new Date(b.bookingDate).toDateString() === date.toDateString()
    ).length;
    return {
      date: date.toLocaleDateString("fr-FR", { weekday: "short" }),
      bookings: count
    };
  }).reverse();

  // Événements pour le calendrier
  const calendarEvents = bookings.map(bk => {
    const start = new Date(bk.bookingDate);
    const [h, m] = bk.startTime.split(":").map(Number);
    start.setHours(h, m);
    const end = new Date(bk.bookingDate);
    const [h2, m2] = bk.endTime.split(":").map(Number);
    end.setHours(h2, m2);
    return {
      id: bk._id,
      title: `${bk.customerName} — ${bk.serviceId?.title || ""}`,
      start,
      end,
      resource: bk
    };
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8 md:mb-12"
          >
            <h2 className="section-title text-center md:text-left">Tableau de bord</h2>
          </motion.header>

          <motion.section initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
              <div className="card-modern p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark/70 mb-2 font-poppins text-sm md:text-base">
                      Réservations totales
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold">{bookings.length}</h3>
                  </div>
                  <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                    <FaCalendarCheck className="text-primary text-lg md:text-xl" />
                  </div>
                </div>
                <div className="mt-2 md:mt-4">
                  <span className="text-green-500 text-xs md:text-sm font-poppins">
                    +{pendingBookings} en attente
                  </span>
                </div>
              </div>

              <div className="card-modern p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark/70 mb-2 font-poppins text-sm md:text-base">
                      Services actifs
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold">{services.length}</h3>
                  </div>
                  <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                    <FaTools className="text-primary text-lg md:text-xl" />
                  </div>
                </div>
                <div className="mt-2 md:mt-4">
                  <span className="text-primary text-xs md:text-sm font-poppins">
                    {services.length} disponibles
                  </span>
                </div>
              </div>

              <div className="card-modern p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark/70 mb-2 font-poppins text-sm md:text-base">
                      Revenus totaux
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold">{totalRevenue}€</h3>
                  </div>
                  <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                    <FaEuroSign className="text-primary text-lg md:text-xl" />
                  </div>
                </div>
                <div className="mt-2 md:mt-4">
                  <span className="text-green-500 text-xs md:text-sm font-poppins">
                    {completedBookings} terminés
                  </span>
                </div>
              </div>

              <div className="card-modern p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark/70 mb-2 font-poppins text-sm md:text-base">
                      Taux de complétion
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold">
                      {bookings.length > 0
                        ? Math.round((completedBookings / bookings.length) * 100)
                        : 0}
                      %
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                    <FaUsers className="text-primary text-lg md:text-xl" />
                  </div>
                </div>
                <div className="mt-2 md:mt-4">
                  <span className="text-primary text-xs md:text-sm font-poppins">
                    {completedBookings} sur {bookings.length}
                  </span>
                </div>
              </div>
            </div>

            

            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="card-modern p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Mon planning</h3>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                messages={{
                  next: "Suivant",
                  previous: "Précédent",
                  today: "Aujourd'hui",
                  month: "Mois",
                  week: "Semaine",
                  day: "Jour"
                }}
                eventPropGetter={({ resource }) => ({
                  style: {
                    backgroundColor:
                      resource.status === "en attente"
                        ? "#fbbf24"
                        : resource.status === "terminé"
                        ? "#22c55e"
                        : resource.status === "annulé"
                        ? "#ef4444"
                        : "#3b82f6",
                    color: "white"
                  }
                })}
              />
            </motion.section>
          </motion.section>
        </div>
        <div className="glass-card p-4 md:p-6 mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-dark">
                Activité des réservations
              </h3>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(1, 5, 6, 0.1)" />
                    <XAxis dataKey="date" stroke="rgba(1, 5, 6, 0.7)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="rgba(1, 5, 6, 0.7)" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="var(--primary)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
      </main>
    </div>
  );
};

export default ArtisanDashboard;
