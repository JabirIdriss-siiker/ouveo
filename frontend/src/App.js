import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtisanDashboard from "./pages/ArtisanDashboard";
import ClientBookings from "./pages/ClientBookings";
import Services from "./pages/Services";
import ArtisanServices from "./pages/ArtisanServices";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PortfolioManagement from './pages/PortfolioManagement';
import Dashboardmesservices from "./components/DashboardMesServices";
import Dashboardbookings from "./components/DashboardBooking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ArtisanVerification from "./pages/admin/ArtisanVerification";
import ContentModeration from "./pages/admin/ContentModeration";
import RevenueTracking from "./pages/admin/RevenueTracking";

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/artisan/dashboard") || location.pathname.startsWith("/admin/");
  const isDashboardServices = location.pathname === "/artisan/portfolio";
  const profile = location.pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
          <Route path="/artisan/dashboard/services" element={<Dashboardmesservices />} />
          <Route path="/artisan/dashboard/bookings" element={<Dashboardbookings />} />
          <Route path="/client/bookings" element={<ClientBookings />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/artisan/:id" element={<ArtisanServices />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/artisan/portfolio" element={<PortfolioManagement />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/verifications" element={<ArtisanVerification />} />
          <Route path="/admin/moderation" element={<ContentModeration />} />
          <Route path="/admin/revenue" element={<RevenueTracking />} />
        </Routes>
      </main>
      {!isDashboard && !isDashboardServices && !profile && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;