/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Checks for valid ID token in localStorage.
 * Redirects to home if not authenticated.
 */

import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is authenticated
  const idToken = localStorage.getItem('idToken');
  
  if (!idToken) {
    // Not authenticated, redirect to home
    console.log('Not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // TODO: Add token expiration check
  // const tokenPayload = parseJwt(idToken);
  // if (tokenPayload.exp * 1000 < Date.now()) {
  //   // Token expired
  //   localStorage.clear();
  //   return <Navigate to="/" replace />;
  // }

  // Authenticated, render children
  return <>{children}</>;
}