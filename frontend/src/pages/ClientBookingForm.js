import React, { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import apiClient from "../api/apiClient";

const ClientBookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    serviceType: "",
    preferredTime: "",
    reason: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/api/messages", formData);
      toast.success("Message envoyé avec succès!");
      setFormData({
        name: "",
        address: "",
        phone: "",
        serviceType: "",
        preferredTime: "",
        reason: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const serviceTypes = [
    "Plomberie",
    "Électricité",
    "Menuiserie",
    "Peinture",
    "Jardinage",
    "Autre"
  ];

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="glass-card p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Contactez-nous</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de service *
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="input-modern"
                required
              >
                <option value="">Sélectionnez un type de service</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horaire préféré *
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="input-modern"
                required
              >
                <option value="">Choisissez un horaire</option>
                <option value="Matin">Matin (8h-12h)</option>
                <option value="Après-midi">Après-midi (12h-17h)</option>
                <option value="Soir">Soir (17h-20h)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description de votre besoin *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className="input-modern"
                placeholder="Décrivez votre besoin..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Envoyer le message"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientBookingForm;