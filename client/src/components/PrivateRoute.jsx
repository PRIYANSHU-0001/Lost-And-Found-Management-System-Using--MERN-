import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, isLoading } = useAuth();
    
    // Optional: Render a loading state while checking user status
    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>;
    }

    // Check if the user is logged in (i.e., user object exists)
    // Outlet will render the child routes (Dashboard, PostItem) if authenticated.
    // Otherwise, redirect to the login page.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;