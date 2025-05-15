
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'owner' | 'staff'>;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    // Redirect to /auth and save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role restrictions are in place and user doesn't have the required role
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role as any))) {
    // Show dashboard with appropriate restrictions based on role
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If logged in and has proper role, render children
  return <>{children}</>;
};

export default RequireAuth;
