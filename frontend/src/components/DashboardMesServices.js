// src/pages/Dashboardmesservices.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Sidebar from "../components/SideBar"; // Fixed typo and assumed path
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/apiClient"; // Adjust path based on your structure

const Dashboardmesservices = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [image, setImage] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [bufferTime, setBufferTime] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const token = localStorage.getItem("token");
  // New state for modification
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const categories = ["Plomberie", "Électricité", "Menuiserie", "Peinture", "Jardinage"];

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/services/my-services");
      // Ensure response.data is an array and each service has timeSlots
      const sortedServices = Array.isArray(response.data)
        ? response.data
            .map((service) => ({
              ...service,
              timeSlots: Array.isArray(service.timeSlots) ? service.timeSlots : [],
            }))
            .sort((a, b) => a.title.localeCompare(b.title))
        : [];
      setServices(sortedServices);
      applyFilters(sortedServices, categoryFilter);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      toast.error("Erreur lors du chargement des services");
      setServices([]); // Ensure services is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      fetchServices();
    }
  }, [token]);

  // Apply filters
  useEffect(() => {
    applyFilters(services, categoryFilter);
  }, [services, categoryFilter]);

  const applyFilters = (servicesList, filter) => {
    const filtered = filter === "all"
      ? servicesList
      : servicesList.filter((s) => s.category === filter);
    setFilteredServices(Array.isArray(filtered) ? filtered : []);
  };

  // Time slot handlers
  const handleAddTimeSlot = (day) => {
    setTimeSlots([...timeSlots, { day, startTime: "09:00", endTime: "17:00" }]);
  };

  const handleRemoveTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index][field] = value;
    setTimeSlots(updatedSlots);
  };

  // Add service
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!title || !price || !description || !category || !duration || timeSlots.length === 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setLoading(true);

    try {
      const serviceData = {
        title,
        price: Number(price),
        description,
        category,
        duration: Number(duration),
        timeSlots,
        bufferTime: Number(bufferTime),
      };

      let response;
      if (image) {
        const formData = new FormData();
        Object.keys(serviceData).forEach((key) => {
          formData.append(key, key === "timeSlots" ? JSON.stringify(serviceData[key]) : serviceData[key]);
        });
        formData.append("image", image);
        response = await apiClient.post("/api/services", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await apiClient.post("/api/services", serviceData);
      }

      setServices((prev) => [...prev, response.data].sort((a, b) => a.title.localeCompare(b.title)));
      toast.success("Service ajouté avec succès !");
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'ajout du service:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du service");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("");
    setDuration("");
    setTimeSlots([]);
    setBufferTime(0);
    setImage(null);
  };

  // Delete service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    setLoading(true);
    try {
      await apiClient.delete(`/api/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
      toast.success("Service supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // New handlers for modification
  const handleOpenEditModal = (service) => {
    setEditService({
      ...service,
      timeSlots: Array.isArray(service.timeSlots) ? service.timeSlots : [],
    });
    setTitle(service.title);
    setPrice(service.price);
    setDescription(service.description);
    setCategory(service.category);
    setDuration(service.duration);
    setTimeSlots(Array.isArray(service.timeSlots) ? service.timeSlots : []);
    setBufferTime(service.bufferTime || 0);
    setImage(null); // Reset image to allow keeping existing or uploading new
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditService(null);
    resetForm();
  };

  const handleModifyService = async (e) => {
    e.preventDefault();
    if (!title || !price || !description || !category || !duration || timeSlots.length === 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("duration", duration);
      formData.append("timeSlots", JSON.stringify(timeSlots));
      formData.append("bufferTime", bufferTime);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      

      if (image) {
        formData.append("image", image);
      }

      const response = await apiClient.put(`/api/services/${editService._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServices((prev) =>
        prev.map((s) => (s._id === editService._id ? response.data : s))
      );
      toast.success("Service modifié avec succès!");
      handleCloseEditModal();
    } catch (error) {
      console.error("Error modifying service:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la modification du service");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="flex min-h-screen bg-light font-anton text-dark">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="container mx-auto">
          {/* Header */}
          <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <h2 className="section-title text-center sm:text-left">Gestion des Services</h2>
            <button
              onClick={fetchServices}
              className="btn-primary px-4 py-2 md:px-6 md:py-3"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="var(--light)" /> : "Rafraîchir"}
            </button>
          </motion.header>

          {/* Services List */}
          <h3 className="text-xl md:text-2xl font-semibold text-dark mb-4 md:mb-6">Mes Services</h3>
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="mb-4 md:mb-6">
              <label className="form-label mb-2 block text-sm md:text-base">Filtrer par catégorie</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-modern w-full sm:w-48 md:w-64"
              >
                <option value="all">Toutes</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading && !services.length ? (
              <div className="flex justify-center py-8 md:py-10">
                <ClipLoader size={40} color="var(--dark)" />
              </div>
            ) : filteredServices.length === 0 ? (
              <p className="text-center text-dark/70 py-8 md:py-10 text-sm md:text-base font-poppins">
                Aucun service trouvé
              </p>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(filteredServices) && filteredServices.map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                    className="card-modern hover-card"
                  >
                    {service.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${service.image}`}
                        alt={service.title}
                        className="w-full h-36 sm:h-48 md:h-48 object-cover rounded-t-3xl"
                      />
                    )}
                    <div className="p-4 sm:p-6">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <h4 className="text-lg sm:text-xl font-semibold text-dark">{service.title}</h4>
                        <span className="text-xl sm:text-2xl font-bold text-primary">{service.price}€</span>
                      </div>
                      <div className="text-dark/70 space-y-2 text-sm sm:text-base font-poppins">
                        <p><strong>Catégorie:</strong> {service.category}</p>
                        <p><strong>Durée:</strong> {service.duration} min</p>
                        <p><strong>Tampon:</strong> {service.bufferTime || 0} min</p>
                        <div>
                          <strong>Disponibilités:</strong>
                          {Array.isArray(service.timeSlots) && service.timeSlots.length > 0 ? (
                            service.timeSlots.map((slot, idx) => (
                              <p key={idx} className="ml-2 text-xs sm:text-sm">
                                {slot.day}: {slot.startTime} - {slot.endTime}
                              </p>
                            ))
                          ) : (
                            <p className="ml-2 text-xs sm:text-sm">Aucun créneau défini</p>
                          )}
                        </div>
                      </div>
                      <p className="text-dark/70 mt-2 line-clamp-3 text-sm sm:text-base font-poppins">
                        {service.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mt-4 md:mt-6">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="btn-primary w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-light"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="btn-primary w-full sm:w-auto bg-dark text-light hover:bg-dark/80"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Add Service Form */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mt-8 md:mt-12">
            <h3 className="text-xl md:text-2xl font-semibold text-dark mb-4 md:mb-6">Ajouter un Service</h3>
            <div className="glass-card p-4 sm:p-6 md:p-8">
              <form onSubmit={handleAddService} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Titre *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-modern"
                      placeholder="Titre du service"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Prix (€) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="input-modern"
                      placeholder="Prix"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-sm md:text-base">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-modern"
                    rows="3 sm:rows-4"
                    placeholder="Décrivez votre service..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Catégorie *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-modern"
                      required
                    >
                      <option value="">Choisir une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Durée (min) *</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="input-modern"
                      placeholder="Durée"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Temps tampon (min)</label>
                    <input
                      type="number"
                      value={bufferTime}
                      onChange={(e) => setBufferTime(e.target.value)}
                      className="input-modern"
                      placeholder="Temps entre réservations"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-sm md:text-base">Horaires de disponibilité *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleAddTimeSlot(day)}
                        className="btn-secondary py-1 md:py-2 text-xs md:text-sm"
                        disabled={timeSlots.some((slot) => slot.day === day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {timeSlots.length === 0 && (
                    <p className="text-dark/60 text-xs md:text-sm font-poppins">
                      Ajoutez au moins un créneau horaire
                    </p>
                  )}
                  <div className="space-y-3 md:space-y-4">
                    {Array.isArray(timeSlots) && timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 bg-light-soft p-3 md:p-4 rounded-xl shadow-sm"
                      >
                        <span className="font-medium text-dark w-20 md:w-24 text-sm md:text-base">
                          {slot.day}
                        </span>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                          className="input-modern w-full sm:w-auto"
                        />
                        <span className="text-dark/80 text-sm md:text-base">à</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                          className="input-modern w-full sm:w-auto"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(index)}
                          className="btn-primary bg-dark text-light hover:bg-dark/80 w-full sm:w-auto mt-2 sm:mt-0"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-sm md:text-base">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="input-modern file:bg-primary file:text-light file:rounded-full file:border-0 file:px-3 md:file:px-4 file:py-1 md:file:py-2 file:hover:bg-primary-dark"
                  />
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="mt-3 md:mt-4 w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md"
                    />
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <ClipLoader size={20} color="var(--light)" /> : "Ajouter le service"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Edit Service Modal */}
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-light rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-dark mb-4 md:mb-6">
                  Modifier le Service
                </h3>
                <form onSubmit={handleModifyService} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="form-group">
                      <label className="form-label text-sm md:text-base">Titre *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-modern"
                        placeholder="Titre du service"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-sm md:text-base">Prix (€) *</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input-modern"
                        placeholder="Prix"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input-modern"
                      rows="3 sm:rows-4"
                      placeholder="Décrivez votre service..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className="form-group">
                      <label className="form-label text-sm md:text-base">Catégorie *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-modern"
                        required
                      >
                        <option value="">Choisir une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-sm md:text-base">Durée (min) *</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="input-modern"
                        placeholder="Durée"
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-sm md:text-base">Temps tampon (min)</label>
                      <input
                        type="number"
                        value={bufferTime}
                        onChange={(e) => setBufferTime(e.target.value)}
                        className="input-modern"
                        placeholder="Temps entre réservations"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Horaires de disponibilité *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleAddTimeSlot(day)}
                          className="btn-secondary py-1 md:py-2 text-xs md:text-sm"
                          disabled={timeSlots.some((slot) => slot.day === day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    {timeSlots.length === 0 && (
                      <p className="text-dark/60 text-xs md:text-sm font-poppins">
                        Ajoutez au moins un créneau horaire
                      </p>
                    )}
                    <div className="space-y-3 md:space-y-4">
                      {Array.isArray(timeSlots) && timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 bg-light-soft p-3 md:p-4 rounded-xl shadow-sm"
                        >
                          <span className="font-medium text-dark w-20 md:w-24 text-sm md:text-base">
                            {slot.day}
                          </span>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                            className="input-modern w-full sm:w-auto"
                          />
                          <span className="text-dark/80 text-sm md:text-base">à</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                            className="input-modern w-full sm:w-auto"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeSlot(index)}
                            className="btn-primary bg-dark text-light hover:bg-dark/80 w-full sm:w-auto mt-2 sm:mt-0"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-sm md:text-base">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="input-modern file:bg-primary file:text-light file:rounded-full file:border-0 file:px-3 md:file:px-4 file:py-1 md:file:py-2 file:hover:bg-primary-dark"
                    />
                    {(image || editService?.image) && (
                      <img
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : `${process.env.REACT_APP_API_URL}/${editService.image}`
                        }
                        alt="Preview"
                        className="mt-3 md:mt-4 w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md"
                      />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                    <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                      {loading ? (
                        <ClipLoader size={20} color="var(--light)" />
                      ) : (
                        "Enregistrer les modifications"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseEditModal}
                      className="btn-primary w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-light"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboardmesservices;