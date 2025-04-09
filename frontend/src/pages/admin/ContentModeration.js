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
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-12 gap-4">
            <h1 className="section-title mb-0 text-center sm:text-left">Modération de Contenu</h1>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-modern w-full sm:w-48 md:w-64 text-sm md:text-base"
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="resolved">Résolus</option>
                <option value="dismissed">Rejetés</option>
              </select>
              <button
                onClick={fetchReports}
                className="btn-primary px-4 py-2 sm:px-6 sm:py-3 text-sm md:text-base"
              >
                Rafraîchir
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8 md:py-10">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : filteredReports.length === 0 ? (
            <p className="text-center text-dark/70 font-poppins text-base md:text-lg">
              Aucun signalement {filter !== "all" ? filter : ""}
            </p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <motion.div
                  key={report._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className="mb-3 md:mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        Signalement #{report._id.slice(-6)}
                      </h3>
                      <span
                        className={`badge font-poppins text-xs md:text-sm ${
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
                    <p className="text-dark/70 text-xs md:text-sm font-poppins">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4 md:mb-6 font-poppins text-sm md:text-base">
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
                    <div className="space-y-3 md:space-y-4">
                      <textarea
                        placeholder="Notes du modérateur..."
                        className="input-modern w-full text-sm md:text-base"
                        rows="2 sm:rows-3"
                        id={`notes-${report._id}`}
                      />
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                        <button
                          onClick={() =>
                            handleReport(
                              report._id,
                              "resolved",
                              document.getElementById(`notes-${report._id}`).value
                            )
                          }
                          className="btn-primary flex-1 bg-green-500 hover:bg-green-600 text-sm md:text-base"
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
                          className="btn-primary flex-1 bg-red-500 hover:bg-red-600 text-sm md:text-base"
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  )}

                  {report.status !== "pending" && report.moderatorNotes && (
                    <div className="mt-3 md:mt-4 p-2 md:p-3 bg-light-soft rounded-xl">
                      <p className="font-semibold font-poppins text-sm md:text-base">
                        Notes du modérateur:
                      </p>
                      <p className="text-dark/70 font-poppins text-xs md:text-sm">
                        {report.moderatorNotes}
                      </p>
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