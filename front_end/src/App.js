import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, Link } from "react-router-dom";
import Home from "./components/Home.js";
import Attendance from "./components/Attendance.js";
import Login from "./components/Login.js";
import Events from "./components/Events.js";
import QrReader from "./components/QrReader.js"; // QR Scanner Component
import AttendancePage from "./components/AttendancePage.js";

const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Check if token exists
};

// ✅ Protected Route Wrapper
const PrivateRoute = () => {
  return isAuthenticated() ? (
    <div>
      <ConditionalNavbar /> {/* ✅ Navbar conditionally renders based on the page */}
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

// ✅ Conditional Navbar: Full on Home, "Back to Home" on Others
const ConditionalNavbar = () => {
  const navigate = useNavigate();
  const path = window.location.pathname; // Get current page path

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    navigate("/login"); // Redirect to login
  };

  // ✅ Full navbar only on Home page
  if (path === "/") {
    return (
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/events">Events</Link>
        <Link to="/qr-scanner">QR Scanner</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    );
  }

  // ✅ Show only "Back to Home" on other pages
  return (
    <nav className="navbar">
      <Link to="/" className="no-underline">Home</Link>
    </nav>
  );
};

// ✅ App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ✅ Wrap protected routes inside PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/attendance" element={<Attendance />} /> {/* Dynamic Route */}
          <Route path="/events" element={<Events />} />
          <Route path="/attendance/:eventId" element={<AttendancePage />} />
          <Route path="/qr-scanner" element={<QrReader />} />
        </Route>

        {/* ✅ Redirect all unknown routes to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;