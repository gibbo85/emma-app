import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext2';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import './App.css';
import ProtectedRoute from './ProtectedRoute';
import Pattern from './components/pattern';
import PatternDetail from './components/PatternDetail';
import RoundDetail from './components/RoundDetail';
import PatternComplete from './components/PatternComplete';

import Header from './components/Header';
import Menu from './components/Menu'; 

function App() {

  const [isOpen, setIsOpen] = useState(false);
  const [isCounterOpen, setIsCounterOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
   setIsOpen(prev => !prev);
  };

  const toggleCounter = () => {
    setIsCounterOpen(prev => !prev);
   };

    // Function to determine if the screen is desktop or mobile
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 768) {
        setIsOpen(true);  // Open menu on desktop
      } else {
        setIsOpen(false); // Close menu on mobile
      }
    };
  
    // Set the initial state and listen for screen resizing
    useEffect(() => {
      handleResize(); // Check on component mount
      window.addEventListener('resize', handleResize); // Listen for resize events
  
      // Cleanup event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <AuthProvider>
      
        <Header isOpen={isOpen} isCounterOpen={isCounterOpen} toggleMenu={toggleMenu} toggleCounter={toggleCounter}/>
        <Menu isOpen={isOpen} toggleMenu={toggleMenu}/>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pattern" element={<Pattern />} />
            <Route path="/:slug" element={
              <ProtectedRoute element={<PatternDetail />} />
            } />
            <Route path="/:patternName/:step" element={
              <ProtectedRoute element={<RoundDetail isCounterOpen={isCounterOpen} toggleCounter={toggleCounter}/>} />
            } />
            <Route path="/:patternName/complete" element={
              <ProtectedRoute element={<PatternComplete />} />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute element={<Dashboard />} />
            } />
          </Routes>
        </main>
      
    </AuthProvider>
  );
}

export default App;