// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2>Easy Bus</h2>
      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/search">Search</Link> 
            <Link to="/history">My Bookings</Link>  
            <Link to="/admin">Admin</Link>  
            <Link to="/booking-history/upcoming">Upcoming</Link>  
            <Link to="/booking-history/past">Past</Link><button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
      <style>{`
  .navbar {
    padding: 1rem 2rem;
    background-color: #1c1c1e;
    color: #f2f2f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2c2c2e;
    box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .navbar h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #ffffff;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .nav-links a,
  .nav-links button {
    padding: 8px 14px;
    background-color: #2c2c2e;
    color: #f2f2f7;
    border: 1px solid #3a3a3c;
    border-radius: 12px;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.25s ease;
    cursor: pointer;
  }

  .nav-links a:hover,
  .nav-links button:hover {
    background-color: #0a84ff;
    color: white;
    border-color: #0a84ff;
    transform: scale(1.05);
  }

  .nav-links button {
    background: #0a84ff;
    border-color: #0a84ff;
    color: white;
  }

  .nav-links button:hover {
    background: #409eff;
  }
`}</style>
    </nav>
  );
};

export default Navbar;
