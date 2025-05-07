import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy mb-8">
          Découvrez Ouveo : La nouvelle ère des services artisanaux
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
          Chez <strong>Ouveo</strong>, nous révolutionnons la manière dont les artisans rencontrent leurs clients. 
          Notre plateforme intelligente et intuitive connecte les professionnels de terrain avec des particuliers et 
          entreprises à la recherche de services fiables, rapides et de qualité.
        </p>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
          Pensée pour valoriser les talents locaux, Ouveo simplifie la réservation, le suivi et la gestion des 
          interventions artisanales. Que vous soyez plombier, électricien, peintre ou client en quête d’expertise, 
          Ouveo est votre allié digital.
        </p>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
          Rejoignez la communauté Ouveo et bénéficiez d’une plateforme qui propulse votre activité artisanale ou 
          facilite votre quotidien, en toute confiance.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-left">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-navy mb-2">🔍 Visibilité accrue</h3>
            <p className="text-gray-600 text-sm">
              Boostez votre présence en ligne et soyez trouvé facilement par des clients proches de chez vous.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-navy mb-2">🤝 Mise en relation simplifiée</h3>
            <p className="text-gray-600 text-sm">
              Notre système intelligent de mise en relation garantit des opportunités ciblées et qualifiées.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold text-navy mb-2">📈 Croissance facilitée</h3>
            <p className="text-gray-600 text-sm">
              Gagnez en temps, en organisation et en revenus grâce à des outils pensés pour développer votre activité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
