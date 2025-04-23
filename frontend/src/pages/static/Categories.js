import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTools,
  FaBolt,
  FaWrench,
  FaPaintRoller,
  FaTree,
  FaHammer,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [search, setSearch] = useState("");

  const categories = [
    {
      id: 'plumbing',
      name: 'Plomberie',
      icon: <FaWrench className="text-4xl text-primary" />,
      description: 'Services de plomberie professionnels pour tous vos besoins',
      services: ['Réparation de fuites', 'Installation sanitaire', 'Débouchage'],
      artisansAvailable: 8,
    },
    {
      id: 'electricity',
      name: 'Électricité',
      icon: <FaBolt className="text-4xl text-primary" />,
      description: 'Solutions électriques sûres et fiables',
      services: ['Installation électrique', 'Dépannage', 'Mise aux normes'],
      artisansAvailable: 12,
    },
    {
      id: 'carpentry',
      name: 'Menuiserie',
      icon: <FaHammer className="text-4xl text-primary" />,
      description: 'Travaux de menuiserie sur mesure',
      services: ['Fabrication', 'Réparation', 'Installation'],
      artisansAvailable: 6,
    },
    {
      id: 'painting',
      name: 'Peinture',
      icon: <FaPaintRoller className="text-4xl text-primary" />,
      description: 'Services de peinture intérieure et extérieure',
      services: ['Peinture intérieure', 'Peinture extérieure', 'Décoration'],
      artisansAvailable: 10,
    },
    {
      id: 'gardening',
      name: 'Jardinage',
      icon: <FaTree className="text-4xl text-primary" />,
      description: 'Entretien et aménagement de jardins',
      services: ['Tonte', 'Taille', 'Aménagement paysager'],
      artisansAvailable: 5,
    },
    {
      id: 'general',
      name: 'Services Généraux',
      icon: <FaTools className="text-4xl text-primary" />,
      description: 'Services de maintenance générale',
      services: ['Réparations diverses', 'Maintenance', 'Installation'],
      artisansAvailable: 15,
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const navigate = useNavigate();
  const handlebooking = () => 
  {
    navigate('/booking');
  }
  return (
    <div className="min-h-screen bg-light py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-4xl font-bold text-center mb-6"
        >
          Catégories de Services
        </motion.h1>

        {/* Barre de recherche */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern w-full max-w-md"
          />
        </div>

        {/* Grid des catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center mb-4">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">{category.name}</h2>
              <p className="text-center text-gray-600 mb-2">{category.description}</p>
              <p className="text-center text-sm text-green-600 font-semibold mb-4">
                {category.artisansAvailable} artisans disponibles
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {category.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <Link
                  to={`/services?category=${category.id}`}
                  className="btn-primary text-sm text-center"
                >
                  Voir les artisans
                </Link>
                <button
                  onClick={handlebooking}
                  className="btn-secondary text-sm text-center"
                >
                  Obtenir un devis
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
