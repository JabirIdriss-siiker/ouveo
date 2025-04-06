import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaStar, FaTools, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Services = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/artisans");
        setArtisans(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des artisans:", error);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-light py-16 px-4 sm:px-8 font-poppins overflow-x-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="section-title text-center"
        >
          Nos Artisans
        </motion.h2>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#f05742" />
          </div>
        ) : artisans.length > 0 ? (
          /* Artisan Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {artisans.map((artisan, index) => (
              <motion.div
                key={artisan._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/services/artisan/${artisan._id}`}
                  className="group card-modern hover-card block overflow-hidden"
                >
                  {/* Header with Image */}
                  <div className="relative h-32 sm:h-40 bg-light-soft">
                    <img
                      src={
                        artisan.profilePicture
                          ? `http://localhost:5000/${artisan.profilePicture}`
                          : `https://ui-avatars.com/api/?name=${artisan.name}&background=random`
                      }
                      alt={artisan.name}
                      className="w-full h-full object-cover border-4 border-light shadow-md"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-12 space-y-4">
                    {/* Name and Specialty */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-dark group-hover:text-primary transition-all duration-300 truncate">
                        {artisan.name}
                      </h3>
                      <p className="text-dark/70 text-sm sm:text-base flex items-center mt-1">
                        <FaTools className="mr-2 text-primary shrink-0" />
                        {artisan.specialty || "Artisan polyvalent"}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-dark/70 text-sm sm:text-base">
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-dark shrink-0" />
                        <span className="truncate">{artisan.location || "Localisation non spécifiée"}</span>
                      </p>
                      <p className="line-clamp-2">
                        {artisan.bio || "Un artisan passionné prêt à vous aider."}
                      </p>
                      <p className="flex items-center">
                        <FaStar className="mr-2 text-primary shrink-0" />
                        {artisan.rating ? `${artisan.rating}/5` : "Non évalué"}
                        {artisan.ratingCount && ` (${artisan.ratingCount} avis)`}
                      </p>
                    </div>

                    {/* Footer with CTA */}
                    <div className="flex justify-between items-center pt-2 border-t border-light/80">
                      <span className="text-primary font-semibold text-sm sm:text-base">
                        {artisan.serviceCount || 0} service{artisan.serviceCount !== 1 ? "s" : ""}
                      </span>
                      <span className="inline-flex items-center gap-2 text-dark font-semibold hover:text-primary transition-colors duration-300">
                        Découvrir
                        <FaMapMarkerAlt className="group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* No Artisans State */
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center text-dark/70 text-lg sm:text-xl font-medium mt-12"
          >
            Aucun artisan disponible pour le moment.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Services;