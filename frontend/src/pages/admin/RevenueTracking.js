// src/pages/admin/RevenueTracking.js
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { jwtDecode } from "jwt-decode";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiClient from "../../api/apiClient"; // Adjust path based on your structure

const RevenueTracking = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchRevenueData();
    }
  }, [token, dateRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/api/admin/revenue?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      setRevenueData(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données de revenus:", error);
      toast.error("Erreur lors du chargement des données de revenus");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return revenueData.reduce((sum, day) => sum + day.totalRevenue, 0);
  };

  const calculateAverageRevenue = () => {
    return revenueData.length ? calculateTotalRevenue() / revenueData.length : 0;
  };

  const calculateTotalBookings = () => {
    return revenueData.reduce((sum, day) => sum + day.bookingsCount, 0);
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
            <h1 className="section-title mb-0">Suivi des Revenus</h1>
            <div className="flex gap-4">
              <div className="flex gap-4 items-center">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="input-modern"
                />
                <span>à</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="input-modern"
                />
              </div>
              <button onClick={fetchRevenueData} className="btn-primary px-6">
                Rafraîchir
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <ClipLoader size={40} color="var(--primary)" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-2">Revenu Total</h3>
                  <p className="text-3xl text-primary">{calculateTotalRevenue().toFixed(2)}€</p>
                  <p className="text-dark/70 text-sm mt-2 font-poppins">Pour la période sélectionnée</p>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-2">Revenu Moyen / Jour</h3>
                  <p className="text-3xl text-primary">{calculateAverageRevenue().toFixed(2)}€</p>
                  <p className="text-dark/70 text-sm mt-2 font-poppins">Pour la période sélectionnée</p>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-2">Total Réservations</h3>
                  <p className="text-3xl text-primary">{calculateTotalBookings()}</p>
                  <p className="text-dark/70 text-sm mt-2 font-poppins">Pour la période sélectionnée</p>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-6">Évolution des Revenus</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="_id"
                        tickFormatter={(date) => {
                          const d = new Date(date.year, date.month - 1, date.day);
                          return d.toLocaleDateString();
                        }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        labelFormatter={(value) => {
                          const d = new Date(value.year, value.month - 1, value.day);
                          return d.toLocaleDateString();
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="var(--primary)"
                        name="Revenus (€)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bookingsCount"
                        stroke="#82ca9d"
                        name="Réservations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="glass-card p-6 mt-8">
                <h3 className="text-xl font-semibold mb-6">Détails des Revenus</h3>
                <div className="overflow-x-auto">
                  <table className="table-modern w-full">
                    <thead>
                      <tr className="table-header">
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Réservations</th>
                        <th className="px-6 py-3">Revenus</th>
                        <th className="px-6 py-3">Moyenne/Réservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((day, index) => (
                        <tr key={index} className="table-cell hover:bg-light-soft">
                          <td className="px-6 py-4 font-poppins">
                            {new Date(day._id.year, day._id.month - 1, day._id.day).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-poppins">{day.bookingsCount}</td>
                          <td className="px-6 py-4 font-poppins">{day.totalRevenue.toFixed(2)}€</td>
                          <td className="px-6 py-4 font-poppins">
                            {day.bookingsCount > 0
                              ? (day.totalRevenue / day.bookingsCount).toFixed(2)
                              : "0.00"}
                            €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueTracking;