import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from "../assests/logo.png"; // adjust path if needed

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded?.user?.role && decoded?.user?.name && decoded?.user?.email) {
        setRole(decoded.user.role);
        setUserInfo({ name: decoded.user.name, email: decoded.user.email });
      } else {
        console.warn("Token decoded but missing user info");
        handleLogout(); // force logout if token is malformed
      }
    } catch (error) {
      console.error("Invalid token", error);
      handleLogout(); // remove corrupted token
    }
  }
}, [token]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Hide Navbar on /artisan/dashboard and its sub-routes
  if (location.pathname.startsWith("/artisan") )
 {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 -auto" />
            <span className="text-xl font-semibold"></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!token && (
              <>
                <Link to="/about" className="nav-link">À propos</Link>
                <Link to="/services" className="nav-link">Nos artisans</Link>
              </>
            )}
            
            {token && role === "client" && (
              <>
                <Link to="/services" className="nav-link">Artisans</Link>
                <Link to="/client/bookings" className="nav-link">Réservations</Link>
                <Link to="/profile" className="nav-link">Profil</Link>
              </>
            )}
            
            {token && role === "artisan" && (
              <>
                <Link to="/artisan/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/profile" className="nav-link">Profil</Link>
              </>
            )}
             {token && role === "secretary" && (
              <>
                <Link to="/secretary/dashboard" className="nav-link">Dashboard</Link>
                
              </>
            )}
            {token && role === "admin" && (
              <>
                <Link to="/admin" className="nav-link">Dashboard</Link>
                
              </>
            )}
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {token ? (
                <div className="flex items-center space-x-4">
                  <span className="text-primary-600 font-medium">{userInfo?.name}</span>
                  <button onClick={handleLogout} className="btn-primary">
                    Déconnexion
                  </button>
                </div>
              ) : (
                
                  <Link to="/login" className="nav-link font-medium">
                    Connexion
                  </Link>
                  
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-2"
          >
            {!token && (
              <>
                <Link to="/about" className="block nav-link py-2">À propos</Link>
                <Link to="/services" className="block nav-link py-2">Services</Link>
              </>
            )}
            
            {token && role === "client" && (
              <>
                <Link to="/services" className="block nav-link py-2">Artisans</Link>
                <Link to="/client/bookings" className="block nav-link py-2">Réservations</Link>
                <Link to="/profile" className="block nav-link py-2">Profil</Link>
              </>
            )}
            
            {token && role === "artisan" && (
              <>
                <Link to="/artisan/dashboard" className="block nav-link py-2">Dashboard</Link>
                <Link to="/profile" className="block nav-link py-2">Profil</Link>
              </>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="w-full text-left nav-link py-2 font-medium"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link to="/login" className="block nav-link py-2">
                  Connexion
                </Link>
                <Link to="/register" className="block nav-link py-2">
                  Inscription
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;