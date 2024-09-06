import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import { Login, Signup, ForgotPassword, Landing, Dashboard, Logout, Profile, Users, PageNotFound, Schedule } from './pages';
import { AuthProvider } from './contexts';
import { ProtectedRoute } from './components';
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/logout" element={<Logout />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
            {/* Add other routes as needed */}
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
