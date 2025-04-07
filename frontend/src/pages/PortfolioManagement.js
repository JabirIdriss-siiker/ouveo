// src/pages/PortfolioManagement.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import apiClient from "../api/apiClient"; // Adjust path based on your structure
import Sidebar from "../components/SideBar";

const PortfolioManagement = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const fetchPortfolio = async () => {
        try {
          const response = await apiClient.get("/api/portfolio/my-portfolio");
          setPortfolio(response.data || []);
        } catch (error) {
          console.error("Erreur lors du chargement du portfolio:", error);
          toast.error("Erreur lors du chargement du portfolio");
        }
      };
      fetchPortfolio();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.error("Veuillez remplir tous les champs");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        // Update existing item
        const response = await apiClient.put(`/api/portfolio/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPortfolio(portfolio.map((item) => (item._id === editId ? response.data : item)));
        toast.success("Projet mis à jour!");
      } else {
        // Add new item
        const response = await apiClient.post("/api/portfolio", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPortfolio([...portfolio, response.data]);
        toast.success("Projet ajouté!");
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setImage(null); // Image must be re-uploaded
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/portfolio/${id}`);
      setPortfolio(portfolio.filter((item) => item._id !== id));
      toast.success("Projet supprimé!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setImage(null);
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="container mx-auto">
          <h2 className="section-title text-center">Gérer mon portfolio</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-modern p-6 sm:p-8 mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-dark mb-4">
              {editId ? "Modifier un projet" : "Ajouter un projet"}
            </h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Titre du projet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-modern"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description du projet"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-modern"
                rows="4"
              />
            </div>
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-dark/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-light hover:file:bg-primary-dark"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex justify-center items-center"
              >
                {loading ? <ClipLoader size={20} color="#f9f8f8" /> : editId ? "Mettre à jour" : "Ajouter"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

          {/* Portfolio List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {portfolio.map((item) => (
              <div key={item._id} className="card-modern hover-card p-4 sm:p-6">
                {item.image && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 object-cover rounded-t-3xl mb-4"
                  />
                )}
                <h4 className="text-lg sm:text-xl font-semibold text-dark mb-2">{item.title}</h4>
                <p className="text-dark/70 text-sm sm:text-base mb-4 line-clamp-3 font-poppins">{item.description}</p>
                <div className="flex space-x-4">
                  <button onClick={() => handleEdit(item)} className="btn-primary flex-1">
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn-primary flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManagement;