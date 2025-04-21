import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserPlus,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../../assests/logo.png";

const SecretarySidebar = ({ userInfo }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { path: "/secretary/dashboard", icon: <FaCalendarAlt />, label: "Calendrier" },
    { path: "/secretary/booking", icon: <FaUserPlus />, label: "Nouvelle réservation" },
    { path: "/secretary/messages", icon: <FaEnvelope />, label: "Messages" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-light rounded-full shadow-lg"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-dark text-light shadow-lg z-40 flex flex-col transition-all duration-300
          ${isOpen ? "w-64" : "w-16 md:w-64"} ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 md:p-6 border-b border-light/20 flex items-center">
          <Link to="/" className="flex items-center space-x-2 w-full">
            <img
              src={logo}
              alt="Logo"
              className={`h-10 w-auto md:h-12 ${isOpen ? "block" : "hidden md:block"}`}
            />
          </Link>
        </div>
        {userInfo && (
          <div className={`p-4 md:mt-4 text-xs md:text-sm ${isOpen ? "block" : "hidden md:block"}`}>
            <p className="text-primary truncate">{userInfo.name}</p>
            <p className="text-light/70 truncate">{userInfo.email}</p>
          </div>
        )}

        <nav className="flex-1 py-4 px-2 md:px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-2 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300
                hover:bg-primary/20 text-light/80 hover:text-light ${
                  isOpen ? "justify-start" : "justify-center md:justify-start"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg md:text-xl">{item.icon}</span>
              <span className={`${isOpen ? "block" : "hidden md:block"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-2 md:p-4 border-t border-light/20">
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 w-full px-2 md:px-4 py-2 md:py-3 rounded-xl
              bg-primary/20 text-light hover:bg-primary/30 transition-all duration-300 ${
                isOpen ? "justify-start" : "justify-center md:justify-start"
              }`}
          >
            <FaSignOutAlt className="text-lg md:text-xl" />
            <span className={`${isOpen ? "block" : "hidden md:block"}`}>Déconnexion</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SecretarySidebar;