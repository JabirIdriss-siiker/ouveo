import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaUserCheck,
  FaShieldAlt,
  FaMoneyBillWave,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../../assests/logo.png";

const AdminSidebar = ({ userInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", icon: <FaChartLine />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Utilisateurs" },
    { path: "/admin/verifications", icon: <FaUserCheck />, label: "Vérifications" },
    { path: "/admin/moderation", icon: <FaShieldAlt />, label: "Modération" },
    { path: "/admin/revenue", icon: <FaMoneyBillWave />, label: "Revenus" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-dark text-light shadow-lg z-50 flex flex-col">
      <div className="p-6 border-b border-light/20">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </Link>
        {userInfo && (
          <div className="mt-4 text-sm">
            <p className="text-primary truncate">{userInfo.name}</p>
            <p className="text-light/70 truncate">{userInfo.email}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                     hover:bg-primary/20 text-light/80 hover:text-light"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-light/20">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl
                   bg-primary/20 text-light hover:bg-primary/30 transition-all duration-300"
        >
          <FaSignOutAlt />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;