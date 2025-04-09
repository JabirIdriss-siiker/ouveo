// src/pages/admin/ArtisanVerification.js
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient"; // Adjust path based on your structure

const ArtisanVerification = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchPendingVerifications();
    }
  }, [token]);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/admin/verifications");
      setArtisans(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des vérifications:", error);
      toast.error("Erreur lors du chargement des vérifications");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (artisanId, approved) => {
    try {
      await apiClient.post("/api/admin/verify-artisan", { artisanId, approved });
      setArtisans(artisans.filter((artisan) => artisan._id !== artisanId));
      toast.success(`Artisan ${approved ? "approuvé" : "rejeté"} avec succès`);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la vérification");
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <AdminSidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-12 gap-4">
            <h1 className="section-title mb-0 text-center sm:text-left">Vérification des Artisans</h1>
            <button
              onClick={fetchPendingVerifications}
              className="btn-primary px-4 py-2 sm:px-6 sm:py-3 text-sm md:text-base"
            >
              Rafraîchir
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8 md:py-10">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : artisans.length === 0 ? (
            <p className="text-center text-dark/70 font-poppins text-base sm:text-lg">
              Aucun artisan en attente de vérification
            </p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {artisans.map((artisan) => (
                <motion.div
                  key={artisan._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <img
                      src={
                        artisan.profilePicture
                          ? `${process.env.REACT_APP_API_URL}/${artisan.profilePicture}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}`
                      }
                      alt={artisan.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold">{artisan.name}</h3>
                      <p className="text-dark/70 font-poppins text-sm md:text-base">{artisan.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 md:mb-6 font-poppins text-sm md:text-base">
                    <p>
                      <strong>Spécialité:</strong> {artisan.specialty || "Non spécifié"}
                    </p>
                    <p>
                      <strong>Localisation:</strong> {artisan.location || "Non spécifié"}
                    </p>
                    <p>
                      <strong>Bio:</strong> {artisan.bio || "Non spécifié"}
                    </p>
                    <p>
                      <strong>Date d'inscription:</strong>{" "}
                      {new Date(artisan.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {artisan.verificationDocuments?.length > 0 && (
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-semibold mb-2 text-sm md:text-base">
                        Documents de vérification:
                      </h4>
                      <div className="space-y-2 font-poppins text-xs md:text-sm">
                        {artisan.verificationDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-dark/70">{doc.type}:</span>
                            <a
                              href={`${process.env.REACT_APP_API_URL}/${doc.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Voir le document
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                    <button
                      onClick={() => handleVerify(artisan._id, true)}
                      className="btn-primary flex-1 bg-green-500 hover:bg-green-600 text-sm md:text-base"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleVerify(artisan._id, false)}
                      className="btn-primary flex-1 bg-red-500 hover:bg-red-600 text-sm md:text-base"
                    >
                      Rejeter
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ArtisanVerification;