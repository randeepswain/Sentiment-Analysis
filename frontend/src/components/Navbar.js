import { Link, useNavigate } from "react-router-dom";

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (

    <nav className="navbar">

      <h2>
        AI Review Analyzer
      </h2>

      <div className="nav-links">

        <Link to="/chatbot">
          Chatbot
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/compare">
          Compare
        </Link>

        <Link to="/recommendations">
          Recommendations
        </Link>

        <Link to="/history">
          History
        </Link>

        <Link to="/about">
          About
        </Link>

        <span 
          onClick={handleLogout} 
          className="logout-link"
          style={{
            color: '#f43f5e',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            marginLeft: '15px',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#ff6b8b';
            e.target.style.textShadow = '0 0 10px rgba(244, 63, 94, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#f43f5e';
            e.target.style.textShadow = 'none';
          }}
        >
          Logout
        </span>

      </div>

    </nav>
  );
}

export default Navbar;