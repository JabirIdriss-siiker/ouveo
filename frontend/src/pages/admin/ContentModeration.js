// src/pages/admin/ContentModeration.js
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient"; // Adjust path based on your structure

const ContentModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [filter, setFilter] = useState("pending");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchReports();
    }
  }, [token]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/admin/reports");
      setReports(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des signalements:", error);
      toast.error("Erreur lors du chargement des signalements");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (reportId, status, moderatorNotes = "") => {
    try {
      await apiClient.put("/api/admin/reports", { reportId, status, moderatorNotes });
      setReports(reports.filter((report) => report._id !== reportId));
      toast.success("Signalement traité avec succès");
    } catch (error) {
      console.error("Erreur lors du traitement du signalement:", error);
      toast.error(error.response?.data?.message || "Erreur lors du traitement du signalement");
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true;
    return report.status === filter;
  });

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
            <h1 className="section-title mb-0">Modération de Contenu</h1>
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-modern w-48"
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="resolved">Résolus</option>
                <option value="dismissed">Rejetés</option>
              </select>
              <button onClick={fetchReports} className="btn-primary px-6">
                Rafraîchir
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : filteredReports.length === 0 ? (
            <p className="text-center text-dark/70 font-poppins text-lg">
              Aucun signalement {filter !== "all" ? filter : ""}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <motion.div
                  key={report._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="glass-card p-6"
                >
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">
                        Signalement #{report._id.slice(-6)}
                      </h3>
                      <span
                        className={`badge font-poppins ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-dark/70 text-sm font-poppins">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6 font-poppins">
                    <p>
                      <strong>Type:</strong> {report.reportedItem?.type || "Non spécifié"}
                    </p>
                    <p>
                      <strong>Raison:</strong> {report.reason}
                    </p>
                    <p>
                      <strong>Description:</strong> {report.description}
                    </p>
                    <p>
                      <strong>Signalé par:</strong> {report.reportedBy?.name || "Utilisateur inconnu"}
                    </p>
                  </div>

                  {report.status === "pending" && (
                    <div className="space-y-4">
                      <textarea
                        placeholder="Notes du modérateur..."
                        className="input-modern w-full"
                        rows="3"
                        id={`notes-${report._id}`}
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            handleReport(
                              report._id,
                              "resolved",
                              document.getElementById(`notes-${report._id}`).value
                            )
                          }
                          className="btn-primary flex-1 bg-green-500 hover:bg-green-600"
                        >
                          Résoudre
                        </button>
                        <button
                          onClick={() =>
                            handleReport(
                              report._id,
                              "dismissed",
                              document.getElementById(`notes-${report._id}`).value
                            )
                          }
                          className="btn-primary flex-1 bg-red-500 hover:bg-red-600"
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  )}

                  {report.status !== "pending" && report.moderatorNotes && (
                    <div className="mt-4 p-3 bg-light-soft rounded-xl">
                      <p className="font-semibold font-poppins">Notes du modérateur:</p>
                      <p className="text-dark/70 font-poppins">{report.moderatorNotes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentModeration;