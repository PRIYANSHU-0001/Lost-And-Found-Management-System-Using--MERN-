import React, { createContext, useReducer, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Check local storage on load
  isLoading: false,
  error: null,
};

// 2. Reducer Function (Handles state changes)
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { user: null, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isLoading: false, error: null };
    case 'LOGIN_FAILURE':
      return { user: null, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, isLoading: false, error: null };
    default:
      return state;
  }
};

// 3. Create the Context
export const AuthContext = createContext(initialState);

// 4. Create the Provider (Wraps the entire application)
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set default headers for all Axios requests
  if (state.user && state.user.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Effect to manage local storage sync
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);

  // Login Function
  const login = async (formData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', payload: err.response.data.message });
      throw new Error(err.response.data.message); // Re-throw for component handling
    }
  };

  // Logout Function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // The value provided to components
  const value = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easier access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};