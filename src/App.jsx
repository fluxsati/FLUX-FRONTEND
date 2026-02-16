import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to sync with Auth state


// Components
import Navbar from "./components/Navbar";
import FluxFooter from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Auth from "./components/Auth";
import Loader from "./components/Loader";

// Lazy Load Pages
const Home = React.lazy(() => import("./pages/Home"));
const BehindFlux = React.lazy(() => import("./pages/BehindFlux"));
const FluxFeatures = React.lazy(() => import("./pages/FLuxFeatures"));
const FluxAbout = React.lazy(() => import("./pages/About"));
const FluxEvent = React.lazy(() => import("./pages/Events"));
const OurTeam = React.lazy(() => import("./pages/Team"));
const FluxProjects = React.lazy(() => import("./pages/Projects"));
const FluxGallery = React.lazy(() => import("./pages/Gallery"));
const FluxContact = React.lazy(() => import("./pages/Contact"));
const FluxSkills = React.lazy(() => import("./pages/Skiils"));
const FluxLearningHub = React.lazy(() => import("./pages/LearningHub"));
const LyfatFlux = React.lazy(() => import("./pages/Fluxlyf"));
const Ideathon = React.lazy(() => import("./pages/Ideathon_26"));
const LegacySite = React.lazy(() => import("./pages/LegacySite"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Technovision = React.lazy(() => import("./pages/Technovision_26"));

const VercelAnalytics = React.lazy(() => import('./VercelAnalytics'));

// Lazy Load Private Pages
const Dashboard = React.lazy(() => import("./Private/Dashboard"));
const AdminDashboard = React.lazy(() => import("./Private/AdminDashboard"));
const GroupChat = React.lazy(() => import("./Private/GroupChat"));

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
          <React.Suspense fallback={<Loader />}>
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
              <Route path="/events/flux-hard-wired" element={<Ideathon />} />
              <Route path="/Old-Site" element={<LegacySite />} />
              <Route path="/technovision-2026" element={<Technovision />} />

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

              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <div className="h-screen pt-24 pb-10 px-4 md:px-10 bg-[#f8fafc] dark:bg-[#050505] transition-colors duration-300">
                      <GroupChat />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all for 404s */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </main>

        <FluxFooter />
        <React.Suspense fallback={null}>
          <VercelAnalytics />
        </React.Suspense>
      </div>
    </Router>
  );
}