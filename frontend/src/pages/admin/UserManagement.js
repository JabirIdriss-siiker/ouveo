// src/pages/admin/UserManagement.js
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient"; // Adjust path based on your structure

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/admin/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await apiClient.put("/api/admin/users/status", { userId, status: newStatus });
      setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)));
      toast.success(`Statut de l'utilisateur mis à jour avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "active") return user.status === "active";
    if (filter === "suspended") return user.status === "suspended";
    return user.role === filter;
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
          <h1 className="section-title mb-12">Gestion des Utilisateurs</h1>

          {/* Filters */}
          <div className="mb-8 flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-modern w-48"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="client">Clients</option>
              <option value="artisan">Artisans</option>
            </select>
            <button onClick={fetchUsers} className="btn-primary px-6">
              Rafraîchir
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : (
            <div className="glass-card p-6 overflow-x-auto">
              <table className="table-modern w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3">Nom</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Rôle</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Date d'inscription</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="table-cell hover:bg-light-soft">
                      <td className="px-6 py-4 font-poppins">{user.name}</td>
                      <td className="px-6 py-4 font-poppins">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge font-poppins ${
                            user.role === "artisan" ? "bg-primary/10" : "bg-dark/10"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge font-poppins ${
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-poppins">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`btn-primary px-4 py-2 ${
                            user.status === "active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {user.status === "active" ? "Suspendre" : "Activer"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserManagement;