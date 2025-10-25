import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Hexsopedia
        </Link>
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/entries/new" className="navbar-link">
              New Entry
            </Link>
            <Link to="/search" className="navbar-link">
              Search
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="navbar-link">
                Admin
              </Link>
            )}
            <span className="navbar-user">
              {user?.username}
            </span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
