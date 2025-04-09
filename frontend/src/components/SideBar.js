// src/components/Sidebar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaTools,
  FaCalendarCheck,
  FaBriefcase,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assests/logo.png"; // Adjust path as needed

const Sidebar = ({ userInfo }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to toggle mobile menu

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: "/artisan/dashboard", icon: <FaChartBar />, label: "Tableau de bord" },
    { path: "/artisan/dashboard/services", icon: <FaTools />, label: "Services" },
    { path: "/artisan/dashboard/bookings", icon: <FaCalendarCheck />, label: "Réservations" },
    { path: "/artisan/portfolio", icon: <FaBriefcase />, label: "Mon Portfolio" },
    { path: "/profile", icon: <FaUser />, label: "Profil" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-light bg-dark p-2 rounded-lg"
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-dark text-light shadow-lg z-40 flex flex-col font-anton transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-light/20">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <span className="text-xl font-semibold rubik-dirt">Ouvéo</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                       hover:bg-primary/20 text-light/80 hover:text-light"
              onClick={() => setIsOpen(false)} // Close menu on link click in mobile
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-light/20">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false); // Close menu on logout
            }}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl
                     bg-primary/20 text-light hover:bg-primary/30 transition-all duration-300"
          >
            <FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Sidebar;