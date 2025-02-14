import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import './style.css';

function Sidebar() {
  const location = useLocation(); // Get the current location

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Survey App</h2>
      </div>
      <ul className="sidebar-menu">
        <li className={`menu-item ${location.pathname === '/exam' ? 'active' : ''}`}>
          <Link to="/exam" className="menu-link">Exams</Link>
        </li>
        <li className={`menu-item ${location.pathname === '/results' ? 'active' : ''}`}>
          <Link to="/results" className="menu-link">Results</Link>
        </li>
        <li className={`menu-item ${location.pathname === '/create' ? 'active' : ''}`}>
          <Link to="/create" className="menu-link">Create Survey</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
