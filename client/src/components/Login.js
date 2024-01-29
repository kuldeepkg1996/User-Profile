import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [passwordWarning, setPasswordWarning] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!email || !password) {
        setEmailWarning(email ? '' : '*Email is required');
        setPasswordWarning(password ? '' : '*Password is required');
        return;
      }

      // Clear existing warnings
      setEmailWarning('');
      setPasswordWarning('');

      const result = await fetch('http://localhost:8000/login', {
        method: 'post',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (result.ok) {
        const data = await result.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', JSON.stringify(data.auth));
        navigate('/');
      } else {
        const error = await result.json();
        console.error('Login error:', error); // Log the error for debugging
        alert(`Error: ${error.error || 'An unexpected error occurred during login'}`);
      }
    } catch (error) {
      console.error('Unexpected error during login:', error); // Log unexpected errors
      alert('An unexpected error occurred during login');
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <input
        type="text"
        className={`inputBox2 ${emailWarning ? 'warning' : ''}`}
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {emailWarning && <p style={{ color: 'red' }} className="warning">{emailWarning}</p>}
      <input
        type="password"
        className={`inputBox2 ${passwordWarning ? 'warning' : ''}`}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {passwordWarning && <p style={{ color: 'red' }} className="warning">{passwordWarning}</p>}
      <button onClick={handleLogin} className="appButton" type="button">
        Login
      </button>
    </div>
  );
};

export default Login;
