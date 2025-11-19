import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth hook
import '../styles/AuthForm.css'; 
import axios from 'axios'; // Still used for API config, but login logic moves to context

function Login() {
  const [formData, setFormData] = useState({ universityId: '', password: '' });
  const [localError, setLocalError] = useState('');
  
  const { universityId, password } = formData;
  const navigate = useNavigate();
  const { login, isLoading } = useAuth(); // <-- Use context functions

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setLocalError(''); // Clear error on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    try {
      // Call the global login function
      await login(formData);
      navigate('/dashboard'); // Redirect on success
    } catch (error) {
      // Error handled by context, but we display the message locally
      setLocalError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign In</h1>
      <form onSubmit={onSubmit}>
        
        {/* Error Message Display */}
        {localError && <div className="error-message">{localError}</div>} 
        
        <div className="form-group">
          <label htmlFor="universityId" className="form-label">University ID</label>
          <input
            type="text"
            id="universityId"
            name="universityId"
            value={universityId}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>
        <button 
          type="submit" 
          className="auth-btn btn btn-primary"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      <Link to="/register" className="auth-link">
        Don't have an account? Register
      </Link>
    </div>
  );
}

export default Login;