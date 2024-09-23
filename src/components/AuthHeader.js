import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/AuthHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCalculator} from '@fortawesome/free-solid-svg-icons'; // Example icons


export default function AuthHeader({ toggleMenu, toggleCounter }) {

  const location = useLocation();

  const isRoundDetailPage = location.pathname.match(/^\/[^\/]+\/\d+$/);

return (
  <header className="auth-header">
    
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
    
      <h1 className="auth-logo"><Link to="/">MyApp</Link></h1>

      <div className='toggles-container'>
      {isRoundDetailPage && (
      <button className='counter-button' onClick={toggleCounter}>
      <FontAwesomeIcon icon={faCalculator} />
      </button>
       )}
      </div>
  </header> 
);
}