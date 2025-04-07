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
      <div className="flex-1 ml-64 p-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="section-title mb-0">Vérification des Artisans</h1>
            <button onClick={fetchPendingVerifications} className="btn-primary px-6">
              Rafraîchir
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : artisans.length === 0 ? (
            <p className="text-center text-dark/70 font-poppins text-lg">
              Aucun artisan en attente de vérification
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artisans.map((artisan) => (
                <motion.div
                  key={artisan._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        artisan.profilePicture
                          ? `${process.env.REACT_APP_API_URL}/${artisan.profilePicture}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}`
                      }
                      alt={artisan.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{artisan.name}</h3>
                      <p className="text-dark/70 font-poppins">{artisan.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 font-poppins">
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
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Documents de vérification:</h4>
                      <div className="space-y-2 font-poppins">
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

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVerify(artisan._id, true)}
                      className="btn-primary flex-1 bg-green-500 hover:bg-green-600"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleVerify(artisan._id, false)}
                      className="btn-primary flex-1 bg-red-500 hover:bg-red-600"
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