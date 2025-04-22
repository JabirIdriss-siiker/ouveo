import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/static/Home";
import Login from "./pages/static/Login";
import Register from "./pages/static/Register";
import ArtisanDashboard from "./pages/ArtisanDashboard";
import SecretaryDashboard from "./pages/secretary/SecretaryDashboard";
import SecretaryBooking from "./pages/secretary/SecretaryBooking";
import SecretaryMessages from "./pages/secretary/SecretaryMessages";
import Services from "./pages/static/Services";
import ArtisanServices from "./pages/ArtisanServices";
import Profile from "./pages/Profile";
import About from "./pages/static/About";
import PortfolioManagement from './pages/PortfolioManagement';
import Dashboardmesservices from "./components/DashboardMesServices";
import Dashboardbookings from "./components/DashboardBooking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ArtisanVerification from "./pages/admin/ArtisanVerification";
import ContentModeration from "./pages/admin/ContentModeration";
import RevenueTracking from "./pages/admin/RevenueTracking";
import ClientBookingForm from "./pages/ClientBookingForm";
import ArtisanMission from "./pages/ArtisanMissions";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isAbout = location.pathname === "/about";
  const isDashboard = location.pathname.startsWith("/artisan/") || 
                     location.pathname.startsWith("/admin/") ||
                     location.pathname.startsWith("/secretary");
  const isDashboardServices = location.pathname === "/artisan/portfolio";
  const profile = location.pathname === "/profile";
  const isSecretaryDashboard = location.pathname.startsWith("/secretary/dashboard");
  
  return (
    <div className="flex flex-col min-h-screen">
      {isHomePage  && <Navbar />}
      { isLogin  && <Navbar />}
      { isRegister && <Navbar />}
      { isAbout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/artisan/:id" element={<ArtisanServices />} />
          <Route path="/about" element={<About />} />

          {/* Protected Artisan Routes */}
          <Route path="/artisan/dashboard" element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanDashboard />
            </ProtectedRoute>
          } />
          <Route path="/artisan/dashboard/services" element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <Dashboardmesservices />
            </ProtectedRoute>
          } />
          <Route path="/artisan/dashboard/bookings" element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <Dashboardbookings />
            </ProtectedRoute>
          } />
          <Route path="/artisan/portfolio" element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <PortfolioManagement />
            </ProtectedRoute>
          } />
          <Route path="/artisan/mission" element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanMission />
            </ProtectedRoute>
          } />

          {/* Protected Secretary Routes */}
          <Route path="/secretary/dashboard" element={
            <ProtectedRoute allowedRoles={['secretary']}>
              <SecretaryDashboard />
            </ProtectedRoute>
          } />
          <Route path="/secretary/booking" element={
            <ProtectedRoute allowedRoles={['secretary']}>
              <SecretaryBooking />
            </ProtectedRoute>
          } />
          <Route path="/secretary/messages" element={
            <ProtectedRoute allowedRoles={['secretary']}>
              <SecretaryMessages />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/verifications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ArtisanVerification />
            </ProtectedRoute>
          } />
          <Route path="/admin/moderation" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ContentModeration />
            </ProtectedRoute>
          } />
          <Route path="/admin/revenue" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RevenueTracking />
            </ProtectedRoute>
          } />

          {/* Protected Multi-Role Routes */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['artisan', 'secretary', 'admin']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/booking" element={
            
              <ClientBookingForm />
            
          } />
        </Routes>
      </main>
      {!isDashboard && !isDashboardServices && !profile && !isSecretaryDashboard && <Footer />}
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