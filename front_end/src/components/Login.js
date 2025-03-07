import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  // ✅ Prevent logged-in users from accessing login page
  if (localStorage.getItem("token")) {
    navigate("/");
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "dummyToken"); // ✅ Simulate authentication
    navigate("/"); // ✅ Redirect to home after login
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="avatar">
          <div className="user-icon"></div>
        </div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="icon" aria-label="Username">&#128100;</span>
            <input type="text" placeholder="Username" required />
          </div>
          <div className="input-group">
            <span className="icon" aria-label="Password">&#128274;</span>
            <input type="password" placeholder="Password" required />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot-password" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </span>
          </div>
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
