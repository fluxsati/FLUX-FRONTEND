import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to sync with Auth state


// Components
import Navbar from "./components/Navbar";
import FluxFooter from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Auth from "./components/Auth";

// Pages
import Home from "./pages/Home";
import BehindFlux from "./pages/BehindFlux";
import FluxFeatures from "./pages/FLuxFeatures";
import FluxAbout from "./pages/About";
import FluxEvent from "./pages/Events";
import OurTeam from "./pages/Team";
import FluxProjects from "./pages/Projects";
import FluxGallery from "./pages/Gallery";
import FluxContact from "./pages/Contact";
import FluxSkills from "./pages/Skiils";
import FluxLearningHub from "./pages/LearningHub";
import LyfatFlux from "./pages/Fluxlyf";

import VercelAnalytics from './VercelAnalytics'; // Import here
// Private Pages
import Dashboard from "./Private/Dashboard";
import AdminDashboard from "./Private/AdminDashboard";

/**
 * Protected Route (For all logged-in users)
 * Now uses Redux state instead of direct localStorage to prevent loops
 */
const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // Use a strict check to ensure userInfo is an object with data
  return userInfo && userInfo._id ? children : <Navigate to="/login" replace />;
};

/**
 * Admin Route (ONLY for users with role 'admin')
 * Now uses Redux state for real-time sync during logout
 */
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  if (!userInfo || !userInfo._id) {
    return <Navigate to="/login" replace />;
  }
  
  return userInfo.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default function App() {
  return (
    <Router>

<div className="bg-white dark:bg-[#050505] text-zinc-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">
        <ScrollToTop />
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route
              path="/"
              element={
                <>
                  <Home />
                   <LyfatFlux />
                  <BehindFlux />
                 
                  <FluxFeatures />
                </>
              }
            />
            <Route path="/about" element={<FluxAbout />} />
            <Route path="/events" element={<FluxEvent />} />
            <Route path="/team" element={<OurTeam />} />
            <Route path="/projects" element={<FluxProjects />} />
            <Route path="/gallery" element={<FluxGallery />} />
            <Route path="/skills" element={<FluxSkills />} />
            <Route path="/contact" element={<FluxContact />} />
            <Route path="/learninghub" element={<FluxLearningHub />} />

            {/* ---------- AUTH ROUTES ---------- */}
            {/* Note: Auth component itself now handles the "already logged in" redirect */}
            <Route path="/login" element={<Auth isLoginMode={true} />} />
            <Route path="/register" element={<Auth isLoginMode={false} />} />

            {/* ---------- PRIVATE ROUTES ---------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <FluxFooter />
        <VercelAnalytics />
      </div>
    </Router>
  );
}