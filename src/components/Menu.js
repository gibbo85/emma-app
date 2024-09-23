import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext2'; // Adjust the path as needed
import '../css/Menu.css';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

// Import Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faConciergeBell, faPhone, faUser, faSignOut} from '@fortawesome/free-solid-svg-icons'; // Example icons


const Menu = ({ isOpen }) => {
  
  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const { user } = useAuth();
  const location = useLocation();

  // Determine if the current page is protected
  const isProtectedPage = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  // Show the menu only if user is logged in and on a protected page
  const showMenu = isProtectedPage;

  return (
    <div>
      {showMenu && (
      <nav className={`menu ${isOpen ? 'open' : ''}`}>
        <h1 className="logo-menu"><Link to="/">MyApp</Link></h1>
        <ul>
          <li><Link to="/dashboard"> <FontAwesomeIcon icon={faHome} className="icon-spacing"/> Dashboard </Link></li>
          <li><a href="#about">
                <FontAwesomeIcon icon={faInfoCircle} className="icon-spacing"/> About
              </a></li>
          <li><a href="#services">
                <FontAwesomeIcon icon={faConciergeBell} className="icon-spacing"/> Services
              </a></li>
          <li><a href="#contact">
                <FontAwesomeIcon icon={faPhone} className="icon-spacing" /> Contact
              </a></li>
          <li>
            
          </li>
        </ul>
        <div className="account-section">
      {/*
           <div className='profile'>
            <Link to="/account">
            <img
              src={user?.profilePicture || 'https://via.placeholder.com/50'} 
              alt="Profile"
              className="profile-picture"
            />
            </Link>
            </div>   
         */}
            <button onClick={handleLogout} className="logout-button">
              <FontAwesomeIcon icon={faSignOut} className="icon-spacing" /> Logout
            </button>
         
          </div>
      </nav>
      )}
    </div>
  );
};

export default Menu;