import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Sidebar from "./SideBar";
import { jwtDecode } from "jwt-decode";

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

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const categories = ["Plomberie", "Électricité", "Menuiserie", "Peinture", "Jardinage"];

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/services/my-services", {
        headers: { "x-auth-token": token },
      });
      const sortedServices = response.data.sort((a, b) => a.title.localeCompare(b.title));
      setServices(sortedServices);
      applyFilters(sortedServices, categoryFilter);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Erreur lors du chargement des services");
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
    setFilteredServices(filtered);
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
        response = await axios.post("http://localhost:5000/api/services", formData, {
          headers: { "x-auth-token": token, "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("http://localhost:5000/api/services", serviceData, {
          headers: { "x-auth-token": token, "Content-Type": "application/json" },
        });
      }

      setServices((prev) => [...prev, response.data].sort((a, b) => a.title.localeCompare(b.title)));
      toast.success("Service ajouté avec succès !");
      resetForm();
    } catch (error) {
      console.error("Error adding service:", error);
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
      await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
        headers: { "x-auth-token": token },
      });
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
      toast.success("Service supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
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
    <div className="flex min-h-screen bg-light">
      <Sidebar userInfo={userInfo} />
      <div className="flex-1 ml-64 p-8">
        <div className="container mx-auto">
          {/* Header */}
          <motion.header
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-12 flex justify-between items-center"
          >
            <h2 className="section-title">Gestion des Services</h2>
            <button
              onClick={fetchServices}
              className="btn-primary px-6 py-3"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="var(--light)" /> : "Rafraîchir"}
            </button>
          </motion.header>

          {/* Services List */}
          <h3 className="text-2xl font-semibold text-dark mb-6">Mes Services</h3>
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="mb-6">
              <label className="form-label mb-2 block">Filtrer par catégorie</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-modern w-full sm:w-64"
              >
                <option value="all">Toutes</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading && !services.length ? (
              <div className="flex justify-center py-10">
                <ClipLoader size={40} color="var(--dark)" />
              </div>
            ) : filteredServices.length === 0 ? (
              <p className="text-center text-dark/70 py-10">Aucun service trouvé</p>
            ) : (
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                
                {filteredServices.map((service, index) => (
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
                        src={`http://localhost:5000/${service.image}`}
                        alt={service.title}
                        className="w-full h-48 object-cover rounded-t-3xl"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-semibold text-dark">{service.title}</h4>
                        <span className="text-2xl font-bold text-primary">{service.price}€</span>
                      </div>
                      <div className="text-dark/70 space-y-2">
                        <p><strong>Catégorie:</strong> {service.category}</p>
                        <p><strong>Durée:</strong> {service.duration} min</p>
                        <p><strong>Tampon:</strong> {service.bufferTime || 0} min</p>
                        <div>
                          <strong>Disponibilités:</strong>
                          {service.timeSlots.map((slot, idx) => (
                            <p key={idx} className="ml-2 text-sm">
                              {slot.day}: {slot.startTime} - {slot.endTime}
                            </p>
                          ))}
                        </div>
                      </div>
                      <p className="text-dark/70 mt-2 line-clamp-3">{service.description}</p>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="btn-primary w-full mt-6  text-light hover:bg-dark/80"
                      >
                        Supprimer
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Add Service Form */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mt-12">
          <h3 className="text-2xl font-semibold text-dark mb-6">Ajouter un Service</h3>
            <div className="glass-card p-6 sm:p-8">
              
              <form onSubmit={handleAddService} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Titre *</label>
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
                    <label className="form-label">Prix (€) *</label>
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
                  <label className="form-label">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-modern"
                    rows="4"
                    placeholder="Décrivez votre service..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="form-label">Catégorie *</label>
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
                    <label className="form-label">Durée (min) *</label>
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
                    <label className="form-label">Temps tampon (min)</label>
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
                  <label className="form-label">Horaires de disponibilité *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleAddTimeSlot(day)}
                        className="btn-secondary py-2"
                        disabled={timeSlots.some((slot) => slot.day === day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {timeSlots.length === 0 && (
                    <p className="text-dark/60 text-sm">Ajoutez au moins un créneau horaire</p>
                  )}
                  <div className="space-y-4">
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-4 bg-light-soft p-4 rounded-xl shadow-sm">
                        <span className="font-medium text-dark w-24">{slot.day}</span>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
                          className="input-modern"
                        />
                        <span className="text-dark/80">à</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
                          className="input-modern"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(index)}
                          className="btn-primary bg-dark text-light hover:bg-dark/80"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="input-modern file:bg-primary file:text-light file:rounded-full file:border-0 file:px-4 file:py-2 file:hover:bg-primary-dark"
                  />
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="mt-4 w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? <ClipLoader size={20} color="var(--light)" /> : "Ajouter le service"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardmesservices;