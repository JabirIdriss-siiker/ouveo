import React, { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaHammer, FaLightbulb, FaHandshake } from "react-icons/fa";
import apiClient from "../api/apiClient"
const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/services");
        setServices(response.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gray-soft font-poppins text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 py-16 px-4 sm:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-50"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative z-10 container mx-auto text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-dark mb-6 text-primary font-rubik-dirt">
            Ouvéo
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-dark/70 max-w-2xl font-rubik-dirt mx-auto mb-10 font-light">
            Connectez-vous à l’excellence artisanale pour des projets qui inspirent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
              Découvrir <FaArrowRight className="text-light" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center justify-center gap-2">
              Rejoindre <FaArrowRight className="text-primary" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-dark to-dark/80">
        <div className="container mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl sm:text-5xl font-bold text-primary  font-rubik-dirt text-center mb-16"
          >
            Une expérience unique
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <FaHammer className=" text-primary " />, title: "Savoir-Faire ", desc: "Des artisans passionnés au service de vos idées." },
              { icon: <FaLightbulb className="text-primary" />, title: "Innovation", desc: "Une plateforme moderne pour des solutions simples." },
              { icon: <FaHandshake className="text-primary" />, title: "Confiance", desc: "Des partenariats locaux, fiables et durables." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex flex-col items-center text-center"
              >
                <div className="text-5xl mb-6 animate-float ">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4 ">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-20 px-4 sm:px-8 bg-gray-soft">
        <div className="container mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="section-title text-center"
          >
            Nos services
          </motion.h2>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <ClipLoader size={40} color="rgb(240, 87, 66)" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {services.length > 0 ? (
                services.slice(0, 6).map((service, index) => (
                  <motion.div
                    key={service._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ delay: index * 0.1 }}
                    className="card-modern hover-card"
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-dark/70 col-span-full text-lg font-medium">
                  Aucun service disponible pour le moment. Devenez artisan dès aujourd’hui !
                </p>
              )}
            </div>
          )}
          {services.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mt-12"
            >
              <Link to="/services" className="btn-primary inline-flex items-center gap-2">
                Explorer tous les services <FaArrowRight className="text-light" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-dark to-dark/80">
        <div className="container mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="section-title text-center font-rubik-dirt text-primary text-light"
          >
            Comment ça marche ?
          </motion.h2>
          <div className="mt-12 max-w-4xl mx-auto space-y-12">
            {[
              { step: "Découvrez", desc: "Parcourez une sélection d’artisans talentueux près de chez vous." },
              { step: "Réservez", desc: "Planifiez votre projet en quelques clics avec un expert." },
              { step: "Créez", desc: "Transformez vos idées en réalité avec un savoir-faire unique." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className=" p-8 flex items-center justify-between"
              >
                <div className="text-left">
                  <h3 className="text-2xl font-semibold text-light mb-2">{item.step}</h3>
                  <p className="text-light/80">{item.desc}</p>
                </div>
                <span className="bg-primary text-light w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  {index + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-dark mb-6 gradient-text">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-dark/70 max-w-xl mx-auto mb-10">
            Rejoignez une communauté d’artisans et de créateurs dès aujourd’hui.
          </p>
          <Link to="/register" className="btn-secondary inline-flex items-center gap-2">
            S’inscrire maintenant <FaArrowRight className="text-primary" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;