import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for redirection
import { login } from '../api/auth';
import './Login.css';  // Import the CSS file for styling

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      setToken(response.data.access_token);
      setMessage('Logged in successfully');

      // Redirect the user to the chat page after successful login
      navigate('/chat');
    } catch (error) {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {message && <p className="login-message">{message}</p>}

      {/* Link to the Register page */}
      <p className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
