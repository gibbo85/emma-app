import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/PublicHeader.css';

export default function PublicHeader() {

  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup'); // Navigate to the sign-up page
  };
  
  return (
    <header className="public-header">
        <h1 className="logo"><Link to="/">MyApp</Link></h1>

        <div className="auth-links">
        <Link to="/login">Login</Link>
        <button onClick={handleSignUp}>SignUp</button>
        </div>
    </header>
  );
}