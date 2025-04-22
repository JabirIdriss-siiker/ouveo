// src/pages/Login.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import apiClient from "../../api/apiClient"; // Adjust path based on your structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      toast.success("Connexion réussie!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-8 px-4 sm:px-6">
      <form onSubmit={handleLogin} className="card-modern p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6 text-center gradient-text font-anton">
          Connexion
        </h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-modern"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-modern"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex justify-center items-center"
        >
          {loading ? <ClipLoader size={20} color="#f9f8f8" /> : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;
