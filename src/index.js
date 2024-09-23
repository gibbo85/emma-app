import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router } from 'react-router-dom';

<Router basename="/emma-app">
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
</Router>

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
