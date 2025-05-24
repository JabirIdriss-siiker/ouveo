import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import apiClient from "../api/apiClient";

const MissionValidation = () => {
  const { token } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await apiClient.get(`/api/missions/validate/${token}`);
        setMission(response.data);
      } catch (error) {
        toast.error("Erreur lors du chargement de la mission");
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [token]);

  const handleValidate = async () => {
    setValidating(true);
    try {
      await apiClient.post(`/api/missions/validate/${token}`);
      toast.success("Mission validée avec succès");
      setMission(prev => ({ ...prev, status: "validated", validatedAt: new Date() }));
    } catch (error) {
      toast.error("Erreur lors de la validation");
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <ClipLoader size={40} color="var(--primary)" />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <p className="text-dark text-xl">Mission non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-modern p-6"
        >
          <h1 className="text-3xl font-bold text-dark mb-6">{mission.title}</h1>
          
          <div className="space-y-4 mb-8">
            <div>
  <h2 className="text-xl font-semibold mb-2">Détails de la mission</h2>
  <p><strong>Problème :</strong> {mission.workDetails.problemDescription}</p>
  <p><strong>Solution :</strong> {mission.workDetails.solutionApplied}</p>
  <p><strong>Recommandations :</strong> {mission.workDetails.recommendations}</p>
  <p><strong>Temps passé :</strong> {mission.workDetails.timeSpent}</p>
</div>

            <div>
              <h3 className="font-semibold mb-2">Artisan</h3>
              <p>{mission.artisanId.name}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Travaux réalisés</h3>
              <p>{mission.workDetails.solutionApplied || "Non spécifié"}</p>
            </div>

            {mission.materials?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Matériaux utilisés</h3>
                <ul className="list-disc pl-5">
                  {mission.materials.map((material, index) => (
                    <li key={index}>
                      {material.name} - {material.quantity} unité(s) - {material.cost}€
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mission.photos?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mission.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_API_URL}/${photo.url}`}
                      alt={photo.description}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {mission.status !== "validated" ? (
            <div className="bg-primary/10 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Validation des travaux</h3>
              <p className="mb-4">
                En validant cette mission, vous confirmez que les travaux ont été réalisés
                conformément à vos attentes.
              </p>
              <button
                onClick={handleValidate}
                disabled={validating}
                className="btn-primary w-full"
              >
                {validating ? (
                  <ClipLoader size={20} color="#ffffff" />
                ) : (
                  "Valider les travaux"
                )}
              </button>
            </div>
          ) : (
            <div className="bg-green-100 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Mission validée
              </h3>
              <p className="text-green-700">
                Cette mission a été validée le{" "}
                {new Date(mission.validatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MissionValidation;