import React from 'react';
import { useNavigate } from 'react-router-dom';
//import '../css/Home.css'; // Import the CSS

export default function Home() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup'); // Navigate to the sign-up page
  };

  return (
    <div className="layout">
      <div className="landing-content">
        <h1 className="form_title">Welcome to Our Amazing App</h1>
        <p>
          Discover a world of possibilities with our app. Sign up now to get started!
        </p>
        <button className= "test_button" onClick={handleSignUp}>
          Get Started
        </button>
      </div>
    </div>
  );
}