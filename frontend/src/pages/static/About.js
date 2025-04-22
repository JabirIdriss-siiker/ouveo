import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-soft py-12 px-4 sm:px-8">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-6 sm:mb-8 text-center">
          À propos d’ArtisansConnect
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6">
          ArtisansConnect est née d’une vision simple : connecter les talents artisanaux aux clients qui en ont besoin.
          Nous sommes une équipe passionnée par le savoir-faire local et l’innovation technologique. Notre plateforme
          offre une expérience fluide et élégante pour trouver, réserver et gérer des services artisanaux de qualité.
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Que vous soyez un client à la recherche d’un professionnel fiable ou un artisan souhaitant développer votre
          activité, ArtisansConnect est là pour vous accompagner avec style et efficacité.
        </p>
      </div>
    </div>
  );
};

export default About;