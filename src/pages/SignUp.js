import React, { useState } from 'react';
import '../css/Auth.css'; // Import the CSS
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext2'; // Ensure this path is correct

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { user, signup } = useAuth();
    const navigate = useNavigate();

      //If already logged in send to dashboard
    if (user) {
        return <Navigate to="/dashboard" />;
      }

    const handleSignUp = async () => {
        try {
          const { user } = await signup(email, password);
    
          if (!user) {
            setMessage("A verification email has been sent. Please check your email.");
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      };

     

  return (
    <div className="layout">
    <div className="container">
      <h1 className="form_title">Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="test_button"onClick={handleSignUp}>Sign Up</button>
      <p className="message">{message}</p>
      <p>
  Already have an account? <Link to="/login">Log in</Link>
</p>
    </div>
    </div>
  );
}
