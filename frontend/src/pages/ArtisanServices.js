// src/pages/ArtisanServices.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient"; // Adjust path based on your structure
import ServiceCard from "../components/ServiceCard";
import { ClipLoader } from "react-spinners";
import { FaStar, FaTools, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ArtisanServices = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, artisanRes, portfolioRes] = await Promise.all([
          apiClient.get(`/api/services/artisan/${id}`),
          apiClient.get(`/api/auth/artisans/${id}`),
          apiClient.get(`/api/portfolio/artisan/${id}`),
        ]);
        setArtisan(artisanRes.data);
        setServices(servicesRes.data || []);
        setPortfolio(portfolioRes.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-light">
        <ClipLoader size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-8 md:py-16 px-2 sm:px-4 md:px-8 font-anton text-dark overflow-x-hidden">
      <div className="container mx-auto px-2 sm:px-4 md:px-0">
        {/* Artisan Profile */}
        {artisan ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="glass-card p-4 sm:p-6 md:p-8 mb-8 md:mb-12 relative overflow-hidden"
          >
            {/* Shimmer Overlay */}
            <div className="shimmer absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>

            {/* Profile Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <img
                src={
                  artisan.profilePicture
                    ? `${process.env.REACT_APP_API_URL}/${artisan.profilePicture}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}&background=random`
                }
                alt={artisan.name}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-light shadow-md animate-float"
              />
              <div className="text-center sm:text-left space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-dark">{artisan.name}</h2>
                <p className="text-dark/70 text-sm sm:text-base md:text-lg flex items-center justify-center sm:justify-start font-poppins">
                  <FaTools className="mr-2 text-primary" />
                  {artisan.specialty || "Artisan polyvalent"}
                </p>
                <p className="text-dark/70 text-sm sm:text-base md:text-lg flex items-center justify-center sm:justify-start font-poppins">
                  <FaMapMarkerAlt className="mr-2 text-dark" />
                  {artisan.location || "Localisation non spécifiée"}
                </p>
                <p className="text-dark/70 text-sm sm:text-base md:text-lg max-w-2xl font-poppins">
                  {artisan.bio || "Un artisan passionné prêt à vous aider."}
                </p>
                <p className="text-primary text-sm sm:text-base md:text-lg flex items-center justify-center sm:justify-start font-poppins">
                  <FaStar className="mr-2" />
                  {artisan.rating ? `${artisan.rating}/5` : "Non évalué"}
                  {artisan.ratingCount && ` (${artisan.ratingCount} avis)`}
                </p>
                <p className="text-dark/70 text-sm sm:text-base md:text-lg font-poppins">
                  <strong className="text-dark">Services:</strong> {services.length}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center text-dark/70 text-base sm:text-lg md:text-xl font-medium mb-8 md:mb-12 font-poppins"
          >
            Artisan non trouvé.
          </motion.p>
        )}

        {/* Portfolio Section */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="section-title text-center mb-6 md:mb-8"
        >
          Portfolio
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
          {portfolio.length > 0 ? (
            portfolio.map((item, index) => (
              <motion.div
                key={item._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="card-modern hover-card group"
              >
                {item.image && (
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${item.image}`}
                      alt={item.title}
                      className="w-full h-36 sm:h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="shimmer absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                )}
                <div className="p-4 sm:p-5 md:p-6">
                  <h4 className="text-base sm:text-lg md:text-xl font-semibold text-dark group-hover:text-primary transition-all duration-300">
                    {item.title}
                  </h4>
                  <p className="text-dark/70 text-xs sm:text-sm md:text-base line-clamp-3 mt-2 font-poppins">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              className="text-center text-dark/70 col-span-full text-sm sm:text-base md:text-lg font-medium font-poppins"
            >
              Cet artisan n'a pas encore ajouté de projets à son portfolio.
            </motion.p>
          )}
        </div>

        {/* Services Section */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="section-title text-center mb-6 md:mb-8"
        >
          Services proposés
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
          {services.length > 0 ? (
            services.map((service, index) => (
              <motion.div
                key={service._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard service={service} className="card-modern hover-card" />
              </motion.div>
            ))
          ) : (
            <motion.p
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              className="text-center text-dark/70 col-span-full text-sm sm:text-base md:text-lg font-medium font-poppins"
            >
              Cet artisan n'a pas encore ajouté de services.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanServices;