import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import AuthenticatedLayout from '../authenticatedLayout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

export default ProtectedRoute;
