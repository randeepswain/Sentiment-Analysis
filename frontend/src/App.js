import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import "./App.css";

// COMPONENTS
import Navbar from "./components/Navbar";

// PAGES
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import About from "./pages/About";
import CompareProducts from "./pages/CompareProducts";
import Recommendations from "./pages/Recommendations";
import ReviewHistory from "./pages/ReviewHistory";

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const isChatPage = location.pathname === "/chatbot";

  return (
    <>
      {isLoggedIn && !isChatPage && <Navbar setIsLoggedIn={setIsLoggedIn} />}

      <Routes>
        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CHATBOT */}
        <Route
          path="/chatbot"
          element={
            isLoggedIn ? (
              <ChatbotPage setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            isLoggedIn ? (
              <About />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* COMPARE */}
        <Route
          path="/compare"
          element={
            isLoggedIn ? (
              <CompareProducts />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* RECOMMENDATIONS */}
        <Route
          path="/recommendations"
          element={
            isLoggedIn ? (
              <Recommendations />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* HISTORY */}
        <Route
          path="/history"
          element={
            isLoggedIn ? (
              <ReviewHistory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}

export default App;