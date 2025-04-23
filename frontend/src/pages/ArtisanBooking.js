import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient";
import BookingForm from "../components/BookingForm";

const ArtisanBooking = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchServices();
    }
  }, [token]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/services/my-services");
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto max-w-2xl">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="section-title text-center mb-8"
          >
            Nouvelle Réservation
          </motion.h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : services.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="glass-card p-6 text-center"
            >
              <p className="text-dark/70 mb-4">Vous n'avez pas encore créé de services.</p>
              <button
                onClick={() => window.location.href = "/artisan/dashboard/services"}
                className="btn-primary"
              >
                Créer un service
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="glass-card p-6"
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionnez un de vos services
                </label>
                <select
                  className="input-modern w-full"
                  value={selectedService?._id || ""}
                  onChange={(e) => setSelectedService(services.find(s => s._id === e.target.value))}
                >
                  <option value="">Choisir un service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.title} - {service.price}€
                    </option>
                  ))}
                </select>
              </div>

              {selectedService && (
                <BookingForm
                  service={selectedService}
                  onSuccess={() => {
                    toast.success("Réservation créée avec succès");
                    setSelectedService(null);
                  }}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanBooking;