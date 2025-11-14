// frontend/src/components/Login.tsx
/**
 * Custom Login Component
 * 
 * Flow:
 * 1. User enters email + password
 * 2. Call Cognito authentication
 * 3. Receive JWT tokens
 * 4. Store in localStorage
 * 5. Redirect to dashboard
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/cognitoService'; 
import '../styles/login.css';
import { isCognitoError } from '../utils/errorHandler';

export default function Login() {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ============================================================================
  // HANDLE LOGIN
  // ============================================================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login for:', email);
      
      // Call Cognito login
      const tokens = await login({ email, password });
      
      console.log('✅ Login successful!', {
        hasAccessToken: !!tokens.accessToken,
        hasIdToken: !!tokens.idToken,
      });
      
      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('idToken', tokens.idToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      // Decode and store user info
      const base64Url = tokens.idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userInfo = JSON.parse(jsonPayload);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      console.log('✅ User authenticated:', userInfo.email);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err: unknown) {  
      console.error('❌ Login error:', err);
      
      // Handle specific errors
      if (isCognitoError(err)) {
        // Handle specific Cognito errors
        if (err.code === 'UserNotConfirmedException') {
          setError('Please verify your email first. Check your inbox for the verification code.');
        } else if (err.code === 'NotAuthorizedException') {
          setError('Incorrect email or password');
        } else if (err.code === 'UserNotFoundException') {
          setError('User not found. Please sign up first.');
        } else {
          setError(err.message || 'Login failed');
        }
      } else if (err instanceof Error) {
        // Handle standard JavaScript errors
        setError(err.message);
      } else {
        // Handle unknown errors
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title">🔐 Welcome Back</h2>
          <p className="auth-subtitle">Sign in to WiseUni Student Portal</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="auth-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          {/* Forgot Password Link */}
          <div className="login-forgot-password">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="login-forgot-link"
            >
              Forgot Password?
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="message-box message-error">
              <span className="message-icon">❌</span>
              <p className="message-text">{error}</p>
            </div>
          )}
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="auth-button auth-button-primary"
          >
            {loading ? (
              <span className="auth-loading">
                <span className="auth-spinner" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="auth-link"
            >
              Sign Up
            </button>
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="auth-back-link"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}