import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaPhone, FaClock, FaCheckCircle } from 'react-icons/fa';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-900 font-poppins">
      
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
            Services artisanaux : plomberie, serrurerie, électricité, chaudières. Disponible 24/7 pour vos besoins urgents.
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

      {/* Présentation */}
      <section className="py-20 px-4 sm:px-8 bg-white">
  <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-12 items-start">
    
    {/* Texte à gauche */}
    <div className="flex-1">
      <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
        À propos de <span className="text-primary">Ouveo</span>
      </h2>

      <article className="prose prose-lg max-w-none text-justify text-gray-800">
        <p>
          Depuis sa création, <strong>Ouveo</strong> simplifie la vie des particuliers et des entreprises en leur permettant de réserver un artisan qualifié en quelques clics. Grâce à une interface intuitive, vous pouvez demander une intervention urgente ou planifier vos travaux selon vos disponibilités, directement depuis votre smartphone ou ordinateur.
        </p>
        <p>
          Ouveo regroupe une large gamme de services : plomberie, électricité, chauffage, serrurerie, vitrerie, assainissement et petits travaux. Tous nos artisans sont certifiés, évalués, et géolocalisés pour garantir un service rapide, efficace et fiable partout en France.
        </p>
        <p>
          Notre mission est d’offrir une expérience client transparente et rassurante. Vous suivez l’état de votre demande en temps réel, bénéficiez de tarifs clairs et avez accès à un support disponible 24/7. Avec Ouveo, le service artisanal devient enfin accessible, humain et digital.
        </p>
      </article>

      {/* Avantages */}
      <div className="mt-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 text-green-600 p-2 rounded-full text-xl">✔</div>
          <div>
            <h4 className="text-lg font-semibold text-dark">Réservation simplifiée</h4>
            <p className="text-gray-600 text-sm">Planifiez votre rendez-vous en ligne, sans appels ni paperasse.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full text-xl">🛠️</div>
          <div>
            <h4 className="text-lg font-semibold text-dark">Services complets</h4>
            <p className="text-gray-600 text-sm">Des artisans qualifiés pour chaque besoin, du dépannage à la rénovation.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full text-xl">📊</div>
          <div>
            <h4 className="text-lg font-semibold text-dark">Suivi et transparence</h4>
            <p className="text-gray-600 text-sm">Notifications en temps réel, historique des interventions et paiements sécurisés.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Image à droite */}
    <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
        alt="Services artisanaux Ouveo"
        className="w-full h-auto object-cover"
      />
    </div>
  </div>
</section>




      {/* Bénéfices */}
      <section className="pb-20 px-4 sm:px-8 bg-gray-soft">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold mb-12 text-center text-navy"
          >
            Les avantages de notre plateforme
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "🔍", title: "Visibilité accrue", text: "Soyez trouvé facilement par des clients proches grâce à notre référencement intelligent." },
              { icon: "📱", title: "Plateforme intuitive", text: "Réserver ou accepter une mission n’a jamais été aussi simple, même depuis votre mobile." },
              { icon: "⚡", title: "Intervention rapide", text: "Recevez ou effectuez des interventions en moins d’une heure grâce à la géolocalisation." },
              { icon: "💬", title: "Communication instantanée", text: "Chat intégré et notifications pour ne jamais rater un rendez-vous ou une demande urgente." },
              { icon: "📊", title: "Tableau de bord intelligent", text: "Suivez vos revenus, vos rendez-vous et votre historique en temps réel." },
              { icon: "🛠️", title: "Tous les services", text: "Plombier, électricien, chauffagiste, vitrier… trouvez ou proposez facilement." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
                }}
                className="bg-white hover:bg-gray-50 shadow-md p-6 rounded-xl transition"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Call To Action */}
          <div className="text-center mt-16">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full"
            >
              Contacter Maintenant <FaPhone className="text-white" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
