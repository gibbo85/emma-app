import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext2'; // Adjust the path as needed
import PublicHeader from './PublicHeader';
import AuthHeader from './AuthHeader';

export default function Header({ isOpen, toggleMenu, isCounterOpen, toggleCounter }) {

  const { user } = useAuth();
  const location = useLocation();

  // Determine if the current page is protected
  const isProtectedPage = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

 
  const showAuthHeader = user && isProtectedPage;
  
  return (
      
     showAuthHeader ? <AuthHeader isOpen={isOpen} toggleMenu={toggleMenu} isCounterOpen={isCounterOpen} toggleCounter={toggleCounter}/>   : <PublicHeader />
     
  );
}



