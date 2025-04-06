import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../assests/logo.png"; // adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
            <span className="text-xl font-semibold"></span>
          </Link>
            <p className="text-gray-400 text-sm">
              Connectez-vous avec des artisans qualifiés pour tous vos projets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors">
                  Nos Artisans
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li>Plomberie</li>
              <li>Électricité</li>
              <li>Menuiserie</li>
              <li>Peinture</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <p className="text-sm mb-2">Email: contact@artisansconnect.com</p>
            <p className="text-sm mb-4">Tél: +33 1 23 45 67 89</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} ArtisansConnect. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;