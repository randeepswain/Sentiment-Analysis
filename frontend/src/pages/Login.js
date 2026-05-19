import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No registered user found. Please register first!");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      setIsLoggedIn(true);
      navigate("/chatbot");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 8%",
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Scattered Emojis that float continuously in the background */}
      <div className="floating-emoji emoji-1">😊</div>
      <div className="floating-emoji emoji-2">😢</div>
      <div className="floating-emoji emoji-3">😐</div>
      <div className="floating-emoji emoji-4">😡</div>
      <div className="floating-emoji emoji-5">🤩</div>

      {/* Brand Copy on Left */}
      <div className="auth-brand-left">
        <h1 style={{ fontSize: "68px", fontWeight: "900", color: "#fff", lineHeight: "1.1", marginBottom: "20px", fontFamily: "Outfit, sans-serif" }}>
          Sentiment <br/>
          <span style={{ background: "linear-gradient(90deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Redefined.
          </span>
        </h1>
        <p style={{ fontSize: "19px", color: "#94a3b8", lineHeight: "1.6", maxWidth: "460px", fontFamily: "Outfit, sans-serif" }}>
          Unlock customer intelligence in seconds. Leverage our advanced Bayesian Classifier to analyze emotional trends and spec-compare feedback instantly.
        </p>
      </div>

      {/* Shifted Auth Card on Right */}
      <motion.div 
        className="auth-box"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ zIndex: 3 }}
      >
        <div 
          style={{
            backgroundColor: "rgba(0, 245, 255, 0.1)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            padding: "16px",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#00f5ff",
            marginBottom: "20px"
          }}
        >
          <LogIn size={28} />
        </div>

        <h1 style={{ fontSize: "40px", fontWeight: "800", margin: "0 0 10px 0", color: "#fff" }}>
          Welcome Back
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "16px", margin: "0 0 35px 0" }}>
          Enter your registered details to continue
        </p>

        {/* Email Input */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "8px 18px",
            marginBottom: "20px"
          }}
        >
          <Mail size={18} style={{ color: "#64748b" }} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "12px 0",
              fontSize: "16px",
              color: "#fff",
              outline: "none"
            }}
          />
        </div>

        {/* Password Input */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "8px 18px",
            marginBottom: "30px"
          }}
        >
          <Lock size={18} style={{ color: "#64748b" }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "12px 0",
              fontSize: "16px",
              color: "#fff",
              outline: "none"
            }}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "17px",
            fontWeight: "600",
            borderRadius: "16px",
            background: "linear-gradient(90deg, #00f5ff, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0, 245, 255, 0.2)"
          }}
        >
          Login Session <ArrowRight size={16} />
        </motion.button>

        <p style={{ marginTop: "25px", fontSize: "15px", color: "#64748b", margin: "25px 0 0 0" }}>
          Don't have an AI account?{" "}
          <span 
            onClick={() => navigate("/register")} 
            style={{ color: "#00f5ff", cursor: "pointer", textDecoration: "underline", fontWeight: "600" }}
          >
            Register Here
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Login;