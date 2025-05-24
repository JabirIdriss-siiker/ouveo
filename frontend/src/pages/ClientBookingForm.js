import React, { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import apiClient from "../api/apiClient";

// Grille tarifaire détaillée par catégorie
const REASONS_BY_CATEGORY = {
  "Serrurerie": [
    "Ouverture porte simple claquée : 110€ – 135€",
    "Clé cassée dans la serrure : à partir de 120€",
    "Dégrippage de serrure : 100€ – 180€",
    "Installation cylindre simple européen : 110€ – 150€",
    "Installation serrure blindée 3 points : 390€ (sur devis)",
    "Grille tarifaire des interventions en serrurerie"
  ],
  "Plomberie": [
    "Débouchage canalisation : 275€ – 390€",
    "Fuite d’eau : 149€ – 199€",
    "Débouchage de WC : 100€ – 200€",
    "Réparation chasse d’eau : 150€ – 250€",
    "Recherche de fuite : 120€ – 380€",
    "Grille tarifaire des interventions en plomberie"
  ],
  "Chauffage": [
    "Réparation de chaudière : 150€ – 350€",
    "Réparation du chauffage : 200€ – 300€",
    "Entretien de chaudière : 90€ – 250€",
    "Fuite chaudière : 149€ – 200€",
    "Réparation ballon d’eau chaude : 150€ – 350€",
    "Grille tarifaire des interventions de chauffage"
  ],
  "Électricité": [
    "Recherche de panne électrique : 110€ – 135€ TTC",
    "Réparation tableau électrique : 150€ – 250€ TTC",
    "Réparation de prises : 110€ – 150€ TTC",
    "Mise aux normes : devis sur-mesure",
    "Réparation radiateur électrique : 200€ – 250€ TTC",
    "Grille tarifaire des interventions en électricité"
  ],
  "Assainissement": [
    "Vidange fosse septique : 250€ – 500€ TTC",
    "Entretien canalisation : 250€ – 400€ TTC",
    "Pompage bac à graisse : 250€ – 500€ TTC",
    "Installation micro-station : à partir de 250€ TTC",
    "Mise aux normes fosse : à partir de 250€ TTC",
    "Grille tarifaire des interventions d’assainissement"
  ],
  "Vitrerie": [
    "Changement vitre double vitrage : 250€ – 500€ TTC",
    "Installation crémone fenêtre : 150€ – 250€ TTC",
    "Réparation fenêtre : 120€ – 210€",
    "Changement vitrine magasin : dès 2 900€ TTC",
    "Pose fenêtre bois : 650€ – 1 000€ TTC",
    "Grille tarifaire des interventions en vitrerie"
  ],
  "Traitement des nuisibles": [
    "Désinsectisation punaises de lit : 200€ – 400€",
    "Dératisation : 200€ – 600€ TTC",
    "Désinsectisation blattes : 200€ – 600€ TTC",
    "Désinsectisation cafards : 200€ – 600€ TTC",
    "Désinsectisation guêpes : 200€ – 600€ TTC",
    "Grille tarifaire des interventions anti-nuisible"
  ],
  "Travaux & bricolage": [
    "Démontage lit : 50€ – 300€ TTC",
    "Peinture plafond : 20€ – 30€ TTC / m²",
    "Pose carrelage : 30€ – 50€ TTC / m²",
    "Pose sol stratifié : 30€ – 50€ / m²",
    "Parquet flottant : 30€ – 60€ / m²",
    "Grille tarifaire des interventions en petit travaux"
  ]
};

const ClientBookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    serviceType: "",
    preferredTime: "",
    reason: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, address, phone, serviceType, preferredTime, reason } = formData;
    if (!name || !email || !address || !phone || !serviceType || !preferredTime || !reason) {
      toast.error("Merci de remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/api/messages", formData);
      toast.success("Message envoyé avec succès !");
      setFormData({ name: "", email: "", address: "", phone: "", serviceType: "", preferredTime: "", reason: "" });
      console.log(email)
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

  const categories = Object.keys(REASONS_BY_CATEGORY);

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="glass-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Contactez-nous</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium mb-1">Nom complet *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-modern" required />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-modern" required />
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium mb-1">Adresse *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-modern" required />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-modern" required />
            </div>

            {/* Catégorie de service */}
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie de service *</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="input-modern" required>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>

            {/* Horaire préféré */}
            <div>
              <label className="block text-sm font-medium mb-1">Horaire préféré *</label>
              <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} className="input-modern" required>
                <option value="">Choisissez un horaire</option>
                <option value="Matin">Matin (8h–12h)</option>
                <option value="Après-midi">Après-midi (12h–17h)</option>
                <option value="Soir">Soir (17h–20h)</option>
              </select>
            </div>

            {/* Raison / Grille tarifaire */}
            <div>
              <label className="block text-sm font-medium mb-1">Motif / Grille tarifaire *</label>
              <select name="reason" value={formData.reason} onChange={handleChange} className="input-modern" required disabled={!formData.serviceType}>
                <option value="">Sélectionnez un motif</option>
                {formData.serviceType && REASONS_BY_CATEGORY[formData.serviceType].map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Bouton */}
            <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center">
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Envoyer le message"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientBookingForm;
