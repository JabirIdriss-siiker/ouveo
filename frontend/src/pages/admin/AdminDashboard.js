// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";
import apiClient from "../../api/apiClient"; // Adjust path based on your structure

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchDashboardStats();
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/admin/dashboard-stats");
      setStats(response.data || {});
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-light">
        <AdminSidebar userInfo={userInfo} />
        <div className="flex-1 md:ml-64 p-4 md:p-8 flex justify-center items-center">
          <ClipLoader size={40} color="var(--primary)" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <AdminSidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="section-title text-center md:text-left mb-6 md:mb-8"
          >
            Tableau de bord administrateur
          </motion.h2>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8"
          >
            {[
              {
                title: "Utilisateurs totaux",
                value: stats?.metrics?.totalUsers || 0,
                color: "bg-blue-500",
              },
              {
                title: "Artisans vérifiés",
                value: stats?.metrics?.verifiedArtisans || 0,
                color: "bg-green-500",
              },
              {
                title: "Réservations complétées",
                value: stats?.metrics?.completedBookings || 0,
                color: "bg-yellow-500",
              },
              {
                title: "Revenus totaux",
                value: `${stats?.metrics?.totalRevenue || 0}€`,
                color: "bg-purple-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="card-modern p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-full mb-3 md:mb-4`} />
                <h3 className="text-lg sm:text-xl font-semibold text-dark">{stat.title}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-primary mt-2 font-poppins">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Growth Chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="card-modern p-4 sm:p-6 mb-6 md:mb-8"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-dark mb-4 md:mb-6">
              Croissance des utilisateurs
            </h3>
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.userGrowth || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Performance */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="card-modern p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-dark mb-4 md:mb-6">
              Performance par catégorie
            </h3>
            <div className="h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.categoryPerformance || []}
                  margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" fontSize={12} />
                  <YAxis yAxisId="left" orientation="left" stroke="var(--primary)" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="bookings"
                    fill="var(--primary)"
                    name="Réservations"
                  />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenus (€)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;