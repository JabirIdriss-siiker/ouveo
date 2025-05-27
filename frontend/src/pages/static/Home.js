import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaPhone, FaTools, FaLock, FaBolt, FaFire, FaHandshake, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const Home = () => {
  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Service Categories
  const serviceCategories = [
    {
      title: 'Plombier',
      description: 'Installation, réparation et entretien de plomberie pour votre maison.',
      icon: <FaTools className="text-primary text-5xl" />,
    },
    {
      title: 'Serrurier',
      description: 'Ouverture de portes, changement de serrures et sécurité renforcée.',
      icon: <FaLock className="text-primary text-5xl" />,
    },
    {
      title: 'Elec/Multi Services',
      description: 'Travaux électriques et services polyvalents pour tous vos besoins.',
      icon: <FaBolt className="text-primary text-5xl" />,
    },
    {
      title: 'Chaudière',
      description: 'Installation et maintenance de chaudières pour un confort optimal.',
      icon: <FaFire className="text-primary text-5xl" />,
    },
  ];

  // Contact Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-soft font-poppins text-gray-900 overflow-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Ouvéo - Services Artisanaux à Domicile</title>
        <meta
          name="description"
          content="Appelez Ouvéo au +33 1 23 45 67 89 pour des services de plomberie, serrurerie, électricité et chaudières. Planifiez votre rendez-vous avec nos artisans experts."
        />
        <meta
          name="keywords"
          content="plombier, serrurier, électricien, chaudière, artisan, services à domicile, Ouvéo"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Ouvéo - Services Artisanaux à Domicile" />
        <meta
          property="og:description"
          content="Contactez Ouvéo pour des services professionnels de plomberie, serrurerie, électricité et chaudières. Appelez maintenant pour planifier !"
        />
        <meta property="og:image" content="https://images.unsplash.com/photo-1581578735769-4fc270d15f92?q=80&w=2670" />
        <meta property="og:url" content="https://www.ouveo.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ouvéo - Services Artisanaux à Domicile" />
        <meta
          name="twitter:description"
          content="Appelez Ouvéo pour des services de plomberie, serrurerie, électricité et chaudières."
        />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1581578735769-4fc270d15f92?q=80&w=2670" />
      </Helmet>

      {/* Hero Section */}
      {/* Hero Section */}
<section className="relative h-[550px] py-20 px-4 sm:px-8 flex items-center justify-center">
  <div className="absolute inset-0">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2670&auto=format&fit=crop')`,
        opacity: 0.5,
      }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-700/80"></div>
  </div>
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="relative z-10 container mx-auto text-center"
  >
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 font-rubik-dirt">
      Ouvéo
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl mx-auto mb-6 font-poppins">
      Plomberie, serrurerie, électricité, chaudières : services artisanaux 24/7. Appelez pour un rendez-vous rapide.
    </p>
    <p className="text-2xl sm:text-3xl font-semibold text-white mb-6">
      <a href="tel:+33123456789" className="hover:underline">+33 1 23 45 67 89</a>
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-primary flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base shadow-md hover:bg-primary-dark hover:scale-105 transition-transform"
      >
        Appeler Maintenant <FaPhone className="text-white" />
      </button>
      <Link
        to="/services"
        className="btn-secondary flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base border-2 border-white hover:bg-white hover:text-primary hover:scale-105 transition-transform"
      >
        Nos Services <FaArrowRight className="text-black" />
      </Link>
    </div>
    <div className="flex justify-center gap-6 mt-6 text-white/80 text-sm sm:text-base">
      <div className="flex items-center gap-2">
        <FaClock className="text-lg" /> Disponible 24/7
      </div>
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-lg" /> Artisans Certifiés
      </div>
    </div>
  </motion.div>
</section>

      {/* Sticky Phone Button (Mobile) */}
      <a
        href="tel:+33123456789"
        className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark md:hidden z-50"
      >
        <FaPhone className="text-2xl" />
      </a>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-dark to-dark/80">
        <div className="container mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl sm:text-5xl font-bold text-primary font-rubik-dirt text-center mb-16"
          >
            Une expérience unique
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <FaTools className="text-primary" />, title: 'Savoir-Faire', desc: 'Des artisans passionnés au service de vos idées.' },
              { icon: <FaBolt className="text-primary" />, title: 'Professionnalisme', desc: 'Un service client dédié pour une expérience fluide.' },
              { icon: <FaHandshake className="text-primary" />, title: 'Confiance', desc: 'Des partenariats locaux, fiables et durables.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex flex-col items-center text-center"
              >
                <div className="text-5xl mb-6 animate-float">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {serviceCategories.map((service, index) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
                className="card-modern hover-card flex flex-col items-center text-center p-6"
              >
                <div className="mb-4 animate-float">{service.icon}</div>
                <h3 className="text-xl font-semibold text-dark mb-2">{service.title}</h3>
                <p className="text-dark/70 text-sm">{service.description}</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 btn-primary text-sm px-4 py-2"
                >
                  Contacter
                </button>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Link to="/categories" className="btn-primary inline-flex items-center gap-2">
              En savoir plus <FaArrowRight className="text-light" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-dark to-dark/80">
  <div className="container mx-auto">
    {/* Titre */}
    <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-white font-rubik-dirt">
      Comment ça marche ?
    </h2>
    <p className="text-center text-white/70 mb-16 text-base sm:text-lg">
      Un processus simple, rapide et efficace pour vous accompagner
    </p>

    <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
      {[
        {
          number: "01",
          title: "Contact Initial",
          description:
            "Appelez-nous ou remplissez le formulaire en ligne pour décrire vos besoins.",
        },
        {
          number: "02",
          title: "Devis Gratuit",
          description:
            "Recevez immédiatement un devis clair et adapté, sans engagement.",
        },
        {
          number: "03",
          title: "Planification",
          description:
            "Nous fixons un rendez-vous selon vos disponibilités, même en urgence.",
        },
        {
          number: "04",
          title: "Intervention",
          description:
            "Nos experts interviennent avec efficacité et professionnalisme.",
        },
      ].map((step, index, arr) => (
        <div key={index} className="flex items-center gap-4">
          {/* Carte étape */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 w-72 lg:w-64 shadow-md hover:shadow-lg transition">
            <span className="text-primary text-3xl font-bold">{step.number}</span>
            <h3 className="text-lg font-semibold text-white mt-2 mb-2">{step.title}</h3>
            <p className="text-sm text-white/80">{step.description}</p>
          </div>

          {/* Flèche entre les cartes sauf après la dernière */}
          {index < arr.length - 1 && (
            <div className="text-white/40 text-3xl hidden lg:block">›</div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>


  <section className="py-20 px-4 sm:px-8 bg-gray-50">
   <div className="container mx-auto">
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="text-3xl font-bold text-center text-gray-900 mb-12"
    >
      Grille tarifaire
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: 'Serrurerie',
          iconClass: 'icon-serrurier-orange',
          link: '/prix/serrurier/',
          items: [
            'Ouverture porte simple claquée : 110€ – 135€',
            'Clé cassée dans la serrure : à partir de 120€',
            'Dégrippage de serrure : 100€ – 180€',
            'Installation cylindre simple européen : 110€ – 150€',
            'Installation serrure blindée 3 points : 390€ (sur devis)'
          ]
        },
        {
          title: 'Plomberie',
          iconClass: 'icon-plombier-orange',
          link: '/prix/plombier/',
          items: [
            'Débouchage canalisation : 275€ – 390€',
            'Fuite d’eau : 149€ – 199€',
            'Débouchage de WC : 100€ – 200€',
            'Réparation chasse d’eau : 150€ – 250€',
            'Recherche de fuite : 120€ – 380€'
          ]
        },
        {
          title: 'Chauffage',
          iconClass: 'icon-chauffagiste-orange',
          link: '/prix/chauffagiste/',
          items: [
            'Réparation de chaudière : 150€ – 350€',
            'Réparation du chauffage : 200€ – 300€',
            'Entretien de chaudière : 90€ – 250€',
            'Fuite chaudière : 149€ – 200€',
            'Réparation ballon d’eau chaude : 150€ – 350€'
          ]
        },
        {
          title: 'Électricité',
          iconClass: 'icon-electricien-orange',
          link: '/prix/electricien/',
          items: [
            'Recherche de panne électrique : 110€ – 135€ TTC',
            'Réparation tableau électrique : 150€ – 250€ TTC',
            'Réparation de prises : 110€ – 150€ TTC',
            'Mise aux normes : devis sur-mesure',
            'Réparation radiateur électrique : 200€ – 250€ TTC'
          ]
        }
      ].map(({ title, iconClass, link, items }, idx) => (
        <motion.div
          key={idx}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 flex flex-col"
        >
          <h3 className={`text-xl font-semibold text-primary border-b-2 border-primary pb-2 mb-4 ${iconClass}`}>
            {title}
          </h3>
          <ul className="flex-1 list-disc list-inside space-y-2 text-gray-700 mb-6 text-sm">
            {items.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
          <Link
            to={link}
            className="mt-auto inline-flex items-center text-primary font-medium hover:underline"
          >
            Voir tous <FaArrowRight className="ml-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
</section>



      
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-dark to-dark/80 text-white">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="text-4xl sm:text-5xl font-bold text-center mb-12 font-rubik-dirt text-primary"
          >
            Questions fréquentes
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                question: "Quels sont vos délais d’intervention ?",
                answer:
                  "Nos artisans interviennent en moyenne en 45 minutes pour les urgences. Vous pouvez aussi planifier un rendez-vous à l’avance selon vos disponibilités.",
              },
              {
                question: "Comment obtenir un devis ?",
                answer:
                  "Vous pouvez obtenir un devis immédiatement en ligne ou en appelant notre service client. Nos tarifs sont transparents et sans frais cachés.",
              },
              {
                question: "L’annulation est-elle gratuite ?",
                answer:
                  "Oui, vous pouvez annuler votre intervention gratuitement jusqu’à 48h avant le rendez-vous.",
              },
              {
                question: "Quels types de paiements acceptez-vous ?",
                answer:
                  "Nous acceptons les paiements par carte bancaire, PayPal, virement bancaire et espèces à la fin des travaux.",
              },
            ].map((item, index) => (
              <details
                key={index}
                className="bg-dark/60 backdrop-blur-md border border-primary/40 rounded-xl p-6 group transition duration-300 hover:shadow-lg"
              >
                <summary className="cursor-pointer font-semibold text-lg flex justify-between items-center text-white">
                  {item.question}
                  <span className="text-primary transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">{item.answer}</p>
              </details>
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
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl text-dark/70 max-w-xl mx-auto mb-10">
            Appelez-nous pour planifier avec nos artisans experts.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            Contacter Maintenant <FaPhone className="text-light" />
          </button>
        </motion.div>
      </section>

      {/* Contact Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="card-modern p-8 max-w-md w-full text-center"
          >
            <h2 className="text-2xl font-bold text-dark mb-4">Contactez-nous</h2>
            <p className="text-dark/70 mb-6">
              Appelez notre équipe pour planifier votre rendez-vous :
            </p>
            <a
              href="tel:+33123456789"
              className="text-3xl font-semibold text-primary hover:text-primary-dark"
            >
              +33 1 23 45 67 89
            </a>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 btn-secondary w-full"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;