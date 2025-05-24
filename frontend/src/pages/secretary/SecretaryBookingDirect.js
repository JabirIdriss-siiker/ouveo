import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import SecretarySidebar from "../../components/secretary/SecretraySidebar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient";
import BookingForm from "../../components/BookingFormArtisan";
import { useLocation } from "react-router-dom"; // ← à ajouter

const SecretaryBooking = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const initialData = location.state?.initialData;
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
      const response = await apiClient.get("/api/services");
      setServices(response.data || []);
    } catch (error) {
      
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
      <SecretarySidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
              <div className="container mx-auto max-w-2xl">
            
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
                        initialData={initialData}
                        onSuccess={() => {
                          toast.success("Réservation créée avec succès");
                          setSelectedService(null);
                        }}
                      />
                    )}
                  </motion.div>
                
              </div>
            </div>
    </div>
  );
};

export default SecretaryBooking;