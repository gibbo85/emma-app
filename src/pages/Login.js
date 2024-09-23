import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import '../css/Auth.css';
import { useAuth } from '../AuthContext2';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  //If already logged in send to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="layout">
    <div className="container">
      <h1 className="form_title">Login</h1>
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
      <button className='test_button' onClick={handleLogin}>Login</button>
      <p className="message">{message}</p>
      <p>
  Don't have an account? <Link to="/signup">Sign up</Link>
</p>
    </div>
    </div>
  );
}