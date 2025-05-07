import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { FaCamera, FaComment, FaCheck, FaTools, FaPlus, FaCalendarCheck } from "react-icons/fa";
import Sidebar from "../components/SideBar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient";

const ArtisanMissions = () => {
  const [missions, setMissions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState({ missions: true, bookings: true });
  const [selectedMission, setSelectedMission] = useState(null);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("missions");
  const [missionDetails, setMissionDetails] = useState({
    problemDescription: "",
    solutionApplied: "",
    recommendations: "",
    timeSpent: 0,
    materials: [],
  });
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: 1, cost: 0 });
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoDescription, setPhotoDescription] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [statusFilter, setStatusFilter] = useState("en attente");
  const [dateFilter, setDateFilter] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchMissions();
      fetchBookings();
    }
  }, [token]);

  useEffect(() => {
    applyFilters(bookings, statusFilter, dateFilter);
  }, [bookings, statusFilter, dateFilter]);

  const fetchMissions = async () => {
    setLoading((prev) => ({ ...prev, missions: true }));
    try {
      const response = await apiClient.get("/api/missions/artisan");
      setMissions(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des missions");
    } finally {
      setLoading((prev) => ({ ...prev, missions: false }));
    }
  };

  const fetchBookings = async () => {
    setLoading((prev) => ({ ...prev, bookings: true }));
    try {
      const response = await apiClient.get("/api/bookings/artisan");
      const sortedBookings = response.data.sort(
        (a, b) =>
          new Date(b.bookingDate + " " + b.startTime) -
          new Date(a.bookingDate + " " + a.startTime)
      );
      setBookings(sortedBookings);
      applyFilters(sortedBookings, statusFilter, dateFilter);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  const applyFilters = (bookingsList, status, date) => {
    let filtered = [...bookingsList];
    if (status !== "all") {
      filtered = filtered.filter((b) => b.status === status);
    }
    if (date) {
      filtered = filtered.filter(
        (b) =>
          new Date(b.bookingDate).toLocaleDateString("fr-FR") ===
          new Date(date).toLocaleDateString("fr-FR")
      );
    }
    setFilteredBookings(filtered);
  };

  const handleAcceptBooking = async (bookingId) => {
    console.log("Accepting booking with ID:", bookingId);
    try {
      const response = await apiClient.post(`/api/bookings/${bookingId}/accept-and-create-mission`, {
        title: "Nouvelle mission",
        description: "Mission créée à partir de la réservation",
      });
      console.log("Success response:", response.data);
      toast.success("Réservation acceptée et mission créée");
      fetchMissions();
      fetchBookings();
    } catch (error) {
      console.error("Error accepting booking:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 404) {
        toast.error("Réservation non trouvée.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Réservation non en attente.");
      } else if (error.response?.status === 500) {
        toast.error(`Erreur serveur: ${error.response.data.message || "Vérifiez le modèle Mission."}`);
      } else {
        toast.error("Erreur lors de l'acceptation de la réservation");
      }
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || newMaterial.quantity <= 0 || newMaterial.cost < 0) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }
    setMissionDetails((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));
    setNewMaterial({ name: "", quantity: 1, cost: 0 });
  };

  const handleRemoveMaterial = (index) => {
    setMissionDetails((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateMission = async (missionId) => {
    try {
      await apiClient.put(`/api/missions/${missionId}`, {
        workDetails: {
          problemDescription: missionDetails.problemDescription,
          solutionApplied: missionDetails.solutionApplied,
          recommendations: missionDetails.recommendations,
          timeSpent: Number(missionDetails.timeSpent),
        },
        materials: missionDetails.materials,
      });
      fetchMissions();
      setShowMissionForm(false);
      toast.success("Mission mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la mission");
    }
  };

  const handleStatusUpdate = async (missionId, status) => {
    try {
      await apiClient.put(`/api/missions/${missionId}/status`, { status });
      fetchMissions();
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };
  const handleRejectBooking = async (bookingId) => {
    console.log("Rejecting booking with ID:", bookingId);
    try {
      await apiClient.post(`/api/bookings/${bookingId}/reject`);
      toast.success("Réservation refusée");
      fetchBookings();
    } catch (error) {
      console.error("Error rejecting booking:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 404) {
        toast.error("Réservation non trouvée.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Réservation non en attente.");
      } else {
        toast.error("Erreur lors du refus de la réservation");
      }
    }
  };
  const handlePhotoUpload = async (missionId) => {
    if (!photo) return;
  
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("description", photoDescription);
  
    try {
      await apiClient.post(`/api/missions/${missionId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      fetchMissions();
      setPhoto(null);
      setPhotoDescription("");
      toast.success("Photo ajoutée avec succès");
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Erreur lors de l'ajout de la photo");
    }
  };
  
  const handleAddComment = async (missionId) => {
    if (!comment.trim()) return;

    try {
      await apiClient.post(`/api/missions/${missionId}/comments`, { text: comment });
      fetchMissions();
      setComment("");
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="section-title text-center mb-8"
          >
            Mes Missions
          </motion.h2>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("missions")}
              className={`px-6 py-2 rounded-t-lg font-semibold ${
                activeTab === "missions"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-dark hover:bg-gray-300"
              } transition-colors`}
            >
              Missions
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-2 rounded-t-lg font-semibold ${
                activeTab === "bookings"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-dark hover:bg-gray-300"
              } transition-colors`}
            >
              Réservations
            </button>
          </div>

          {/* Missions Tab */}
          {activeTab === "missions" && (
            <div>
              {loading.missions ? (
                <div className="flex justify-center py-8">
                  <ClipLoader size={40} color="var(--primary)" />
                </div>
              ) : missions.length === 0 ? (
                <p className="text-center text-dark/70">Aucune mission en cours</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {missions.map((mission) => (
                    <motion.div
                      key={mission._id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      className="card-modern p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{mission.title}</h3>
                        <span
                          className={`badge ${
                            mission.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : mission.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {mission.status === "pending"
                            ? "En attente"
                            : mission.status === "in_progress"
                            ? "En cours"
                            : "Terminé"}
                        </span>
                      </div>

                      <div className="space-y-2 text-dark/70 mb-4">
                        <p>
                          <strong>Client:</strong> {mission.clientName}
                        </p>
                        <p>
                          <strong>Adresse:</strong> {mission.clientAddress}
                        </p>
                        <p>
                          <strong>Téléphone:</strong> {mission.clientPhone}
                        </p>
                        <p>
                          <strong>Description:</strong> {mission.description}
                        </p>
                       
                      </div>

                      <button
                        onClick={() => {
                          setSelectedMission(mission);
                          setMissionDetails({
                            problemDescription:
                              mission.workDetails?.problemDescription || "",
                            solutionApplied:
                              mission.workDetails?.solutionApplied || "",
                            recommendations:
                              mission.workDetails?.recommendations || "",
                            timeSpent: mission.workDetails?.timeSpent || 0,
                            materials: mission.materials || [],
                          });
                          setShowMissionForm(true);
                        }}
                        className="btn-primary w-full mb-4"
                      >
                        <FaTools className="inline mr-2" /> Détails du travail
                      </button>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Photos</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {mission.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={`${process.env.REACT_APP_API_URL}/${photo.url}`}
                              alt={photo.description}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            className="input-modern text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Description de la photo"
                            value={photoDescription}
                            onChange={(e) => setPhotoDescription(e.target.value)}
                            className="input-modern mt-2 text-sm"
                          />
                          <button
                            onClick={() => handlePhotoUpload(mission._id)}
                            className="btn-primary w-full mt-2 text-sm"
                          >
                            <FaCamera className="inline mr-2" /> Ajouter une photo
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Commentaires</h4>
                        <div className="space-y-2 mb-2">
                          {mission.comments.map((comment, index) => (
                            <div
                              key={index}
                              className="bg-light-soft p-2 rounded-lg text-sm"
                            >
                              <p className="font-medium">{comment.createdBy?.name}</p>
                              <p className="text-dark/70">{comment.text}</p>
                              <p className="text-xs text-dark/50">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ajouter un commentaire"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input-modern flex-1 text-sm"
                          />
                          <button
                            onClick={() => handleAddComment(mission._id)}
                            className="btn-primary px-4"
                          >
                            <FaComment />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {mission.status !== "completed" && (
                          <button
                            onClick={() => handleStatusUpdate(mission._id, "completed")}
                            className="btn-primary flex-1 bg-green-500 hover:bg-green-600"
                          >
                            <FaCheck className="inline mr-2" /> Terminer
                          </button>
                        )}
                        {mission.status === "pending" && (
                          <button
                            onClick={() => handleStatusUpdate(mission._id, "in_progress")}
                            className="btn-primary flex-1"
                          >
                            Démarrer
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div>
              {/* Filters */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-modern w-full"
                  >
                    <option value="all">Tous</option>
                    <option value="en attente">En attente</option>
                    <option value="accepté">Accepté</option>
                    <option value="refusé">Refusé</option>
                    <option value="terminé">Terminé</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input-modern w-full"
                  />
                </div>
              </div>

              {loading.bookings ? (
                <div className="flex justify-center py-8">
                  <ClipLoader size={40} color="var(--primary)" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <p className="text-center text-dark/70">
                  Aucune réservation correspondant aux filtres
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      className="card-modern p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">
                          {booking.serviceId?.title || "Réservation"}
                        </h3>
                        <span
                          className={`badge ${
                            booking.status === "en attente"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "accepté"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "refusé"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status === "en attente"
                            ? "En attente"
                            : booking.status === "accepté"
                            ? "Accepté"
                            : booking.status === "refusé"
                            ? "Refusé"
                            : "Terminé"}
                        </span>
                      </div>

                      <div className="space-y-2 text-dark/70 mb-4">
                        <p>
                          <strong>Client:</strong> {booking.customerName}
                        </p>
                        <p>
                          <strong>Adresse:</strong> {booking.clientAddress || "N/A"}
                        </p>
                        <p>
                          <strong>Téléphone:</strong> {booking.customerPhone}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(booking.bookingDate).toLocaleDateString()} à{" "}
                          {booking.startTime}
                        </p>
                        <p>
                          <strong>Notes:</strong> {booking.notes || "Aucune"}
                        </p>
                      </div>

                      {booking.status === "en attente" && (
                       <div className="space-y-2">
                       <button
                         onClick={() => handleAcceptBooking(booking._id)}
                         className="btn-primary w-full bg-green-500 hover:bg-green-600"
                       >
                         <FaCalendarCheck className="inline mr-2" /> Accepter
                       </button>
                       <button
                         onClick={() => handleRejectBooking(booking._id)}
                         className="btn-secondary w-full bg-red-500 hover:bg-red-600"
                       >
                         Refuser
                       </button>
                     </div>
                        
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mission Details Form Modal */}
          {showMissionForm && selectedMission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Détails du travail</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description du problème
                    </label>
                    <textarea
                      value={missionDetails.problemDescription}
                      onChange={(e) =>
                        setMissionDetails((prev) => ({
                          ...prev,
                          problemDescription: e.target.value,
                        }))
                      }
                      className="input-modern"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Solution appliquée
                    </label>
                    <textarea
                      value={missionDetails.solutionApplied}
                      onChange={(e) =>
                        setMissionDetails((prev) => ({
                          ...prev,
                          solutionApplied: e.target.value,
                        }))
                      }
                      className="input-modern"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Recommandations
                    </label>
                    <textarea
                      value={missionDetails.recommendations}
                      onChange={(e) =>
                        setMissionDetails((prev) => ({
                          ...prev,
                          recommendations: e.target.value,
                        }))
                      }
                      className="input-modern"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Temps passé (minutes)
                    </label>
                    <input
                      type="number"
                      value={missionDetails.timeSpent}
                      onChange={(e) =>
                        setMissionDetails((prev) => ({
                          ...prev,
                          timeSpent: e.target.value,
                        }))
                      }
                      className="input-modern"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Matériaux utilisés
                    </label>
                    <div className="space-y-2">
                      {missionDetails.materials.map((material, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-light-soft p-2 rounded"
                        >
                          <span>{material.name}</span>
                          <span>x{material.quantity}</span>
                          <span>{material.cost}€</span>
                          <button
                            onClick={() => handleRemoveMaterial(index)}
                            className="ml-auto text-red-500"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        placeholder="Nom du matériau"
                        value={newMaterial.name}
                        onChange={(e) =>
                          setNewMaterial((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="input-modern"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Quantité"
                          value={newMaterial.quantity}
                          onChange={(e) =>
                            setNewMaterial((prev) => ({
                              ...prev,
                              quantity: Number(e.target.value),
                            }))
                          }
                          className="input-modern w-1/2"
                          min="1"
                        />
                        <input
                          type="number"
                          placeholder="Coût unitaire (€)"
                          value={newMaterial.cost}
                          onChange={(e) =>
                            setNewMaterial((prev) => ({
                              ...prev,
                              cost: Number(e.target.value),
                            }))
                          }
                          className="input-modern w-1/2"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <button
                        onClick={handleAddMaterial}
                        className="btn-primary w-full"
                      >
                        <FaPlus className="inline mr-2" /> Ajouter un matériau
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleUpdateMission(selectedMission._id)}
                    className="btn-primary flex-1"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setShowMissionForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Annuler
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

export default ArtisanMissions;