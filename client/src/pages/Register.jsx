import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthForm.css'; // Uses the same clean styling

function Register() {
  const [formData, setFormData] = useState({
    universityId: '',
    name: '',
    email: '',
    password: '',
    password2: '', // For password confirmation
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { universityId, name, email, password, password2 } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setLocalError(''); 
    setSuccessMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    
    if (password !== password2) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = { universityId, name, email, password };
      
      // Call the backend registration API
      await axios.post('/api/auth/register', userData);
      
      setSuccessMessage('Registration successful! Redirecting to login...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      // Display the error message from the backend (e.g., User already exists)
      const errorMessage = error.response?.data?.message || 'Registration failed due to server error.';
      setLocalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Create Account</h1>
      <form onSubmit={onSubmit}>

        {/* Success/Error Message Display */}
        {localError && <div className="error-message">{localError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" id="name" name="name" value={name} onChange={onChange} className="form-input" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="universityId" className="form-label">University ID</label>
          <input type="text" id="universityId" name="universityId" value={universityId} onChange={onChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} className="form-input" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} className="form-input" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password2" className="form-label">Confirm Password</label>
          <input type="password" id="password2" name="password2" value={password2} onChange={onChange} className="form-input" required />
        </div>
        
        <button type="submit" className="auth-btn btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <Link to="/login" className="auth-link">
        Already have an account? Sign In
      </Link>
    </div>
  );
}

export default Register;