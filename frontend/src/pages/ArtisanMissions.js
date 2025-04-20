import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { FaCamera, FaComment, FaCheck, FaTools, FaPlus } from "react-icons/fa";
import Sidebar from "../components/SideBar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient";

const ArtisanMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [missionDetails, setMissionDetails] = useState({
    problemDescription: "",
    solutionApplied: "",
    recommendations: "",
    timeSpent: 0,
    materials: []
  });
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: 1, cost: 0 });
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoDescription, setPhotoDescription] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchMissions();
    }
  }, [token]);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/missions/artisan");
      setMissions(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || newMaterial.quantity <= 0 || newMaterial.cost < 0) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }
    setMissionDetails(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
    setNewMaterial({ name: "", quantity: 1, cost: 0 });
  };

  const handleRemoveMaterial = (index) => {
    setMissionDetails(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateMission = async (missionId) => {
    try {
      await apiClient.put(`/api/missions/${missionId}`, {
        workDetails: {
          problemDescription: missionDetails.problemDescription,
          solutionApplied: missionDetails.solutionApplied,
          recommendations: missionDetails.recommendations,
          timeSpent: Number(missionDetails.timeSpent)
        },
        materials: missionDetails.materials
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

  const handlePhotoUpload = async (missionId) => {
    if (!photo) return;

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("description", photoDescription);

    try {
      await apiClient.post(`/api/missions/${missionId}/photos`, formData);
      fetchMissions();
      setPhoto(null);
      setPhotoDescription("");
      toast.success("Photo ajoutée avec succès");
    } catch (error) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

          {loading ? (
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
                    <span className={`badge ${
                      mission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      mission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {mission.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-dark/70 mb-4">
                    <p><strong>Client:</strong> {mission.clientName}</p>
                    <p><strong>Adresse:</strong> {mission.clientAddress}</p>
                    <p><strong>Téléphone:</strong> {mission.clientPhone}</p>
                    <p><strong>Description:</strong> {mission.description}</p>
                    <p><strong>Réservation:</strong> {mission.bookingId?.serviceId?.title}</p>
                  </div>

                  {/* Work Details Button */}
                  <button
                    onClick={() => {
                      setSelectedMission(mission);
                      setMissionDetails({
                        problemDescription: mission.workDetails?.problemDescription || "",
                        solutionApplied: mission.workDetails?.solutionApplied || "",
                        recommendations: mission.workDetails?.recommendations || "",
                        timeSpent: mission.workDetails?.timeSpent || 0,
                        materials: mission.materials || []
                      });
                      setShowMissionForm(true);
                    }}
                    className="btn-primary w-full mb-4"
                  >
                    <FaTools className="inline mr-2" /> Détails du travail
                  </button>

                  {/* Photos Section */}
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

                  {/* Comments Section */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Commentaires</h4>
                    <div className="space-y-2 mb-2">
                      {mission.comments.map((comment, index) => (
                        <div key={index} className="bg-light-soft p-2 rounded-lg text-sm">
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

                  {/* Status Update */}
                  <div className="flex gap-2">
                    {mission.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusUpdate(mission._id, 'completed')}
                        className="btn-primary flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <FaCheck className="inline mr-2" /> Terminer
                      </button>
                    )}
                    {mission.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(mission._id, 'in_progress')}
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
      </div>

      {/* Mission Details Form Modal */}
      {showMissionForm && selectedMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Détails du travail</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description du problème</label>
                <textarea
                  value={missionDetails.problemDescription}
                  onChange={(e) => setMissionDetails(prev => ({
                    ...prev,
                    problemDescription: e.target.value
                  }))}
                  className="input-modern"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Solution appliquée</label>
                <textarea
                  value={missionDetails.solutionApplied}
                  onChange={(e) => setMissionDetails(prev => ({
                    ...prev,
                    solutionApplied: e.target.value
                  }))}
                  className="input-modern"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recommandations</label>
                <textarea
                  value={missionDetails.recommendations}
                  onChange={(e) => setMissionDetails(prev => ({
                    ...prev,
                    recommendations: e.target.value
                  }))}
                  className="input-modern"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Temps passé (minutes)</label>
                <input
                  type="number"
                  value={missionDetails.timeSpent}
                  onChange={(e) => setMissionDetails(prev => ({
                    ...prev,
                    timeSpent: e.target.value
                  }))}
                  className="input-modern"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Matériaux utilisés</label>
                <div className="space-y-2">
                  {missionDetails.materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2 bg-light-soft p-2 rounded">
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
                    onChange={(e) => setNewMaterial(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="input-modern"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Quantité"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial(prev => ({
                        ...prev,
                        quantity: Number(e.target.value)
                      }))}
                      className="input-modern w-1/2"
                      min="1"
                    />
                    <input
                      type="number"
                      placeholder="Coût unitaire (€)"
                      value={newMaterial.cost}
                      onChange={(e) => setNewMaterial(prev => ({
                        ...prev,
                        cost: Number(e.target.value)
                      }))}
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
  );
};

export default ArtisanMissions;