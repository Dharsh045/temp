import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import "../Styles/Home.css"; // Ensure correct path to styles

const Home = () => {
  const navigate = useNavigate(); // ✅ Defined useNavigate properly

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">NSS</div>
          <ul className="nav-links">
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </div>
        <button 
          className="logout-btn" 
          onClick={() => {
            localStorage.removeItem("token"); // ✅ Clears authentication token
            navigate("/login"); // ✅ Redirects to login
          }}>
          Logout
        </button>
      </nav>

      {/* Main Section */}
      <div className="home-container">
        <h1>Where NSS Activities Happen</h1>
        <p>Track events, mark attendance, and manage NSS activities seamlessly.</p>
        <button 
          className="get-started-btn"
          onClick={() => navigate("/events")} // ✅ Navigates to Events page on click
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
