import React from 'react';
import './HeroSection.css';
import { FaPhone, FaArrowRight, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      {/* Image avec lazy loading */}
      <div className="hero-background">
  <picture>
    <source srcSet="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=60&w=1920&fm=webp" type="image/webp" />
    <img
      src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=60&w=1920&auto=format&fit=crop"
      alt="Artisan de confiance"
      loading="lazy"
      className="hero-img"
    />
  </picture>
</div>


      <div className="hero-content">
        <h1 className="hero-title">Ouvéo - Votre artisan de confiance</h1>
        <p className="hero-subtitle">
          Plomberie, serrurerie, électricité, chaudières : services artisanaux 24/7. Appelez pour un rendez-vous rapide.
        </p>
        <p className="hero-phone">
          <a href="tel:+33123456789" className="phone-link">+33 1 23 45 67 89</a>
        </p>
        <div className="hero-buttons">
          <a href="tel:+33123456789" className="hero-button primary" aria-label="Appeler le numéro Ouvéo">
            <FaPhone /> Appeler Maintenant
          </a>
          <Link to="/services" className="hero-button secondary" aria-label="Accéder aux services Ouvéo">
            <FaArrowRight /> Nos Services
          </Link>
        </div>
        <div className="hero-info">
          <span className="info-item">
            <FaClock /> Disponible 24/7
          </span>
          <span className="info-item">
            <FaCheckCircle /> Artisans Certifiés
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
