import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth';


const RequireAuth = () => {
    const { auth } = useAuth();

    let location = useLocation();
    return (
        auth?.accessToken //changed from user to accessToken to persist login after refresh
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;