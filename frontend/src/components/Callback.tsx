// frontend/src/components/Callback.tsx
/**
 * OAuth Callback Handler
 * 
 * This component handles the OAuth 2.0 authorization code flow redirect from Cognito.
 * It exchanges the authorization code for JWT tokens and stores them.
 * 
 * Flow:
 * 1. Cognito redirects here with: ?code=xxx
 * 2. Exchange code for tokens (POST to /oauth2/token)
 * 3. Save tokens to localStorage
 * 4. Redirect to dashboard
 */

import { useEffect, useState,useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cognitoConfig } from '../config/cognito';

type CallbackStatus = 'loading' | 'success' | 'error';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [error, setError] = useState<string>('');

  const hasRun = useRef(false); // To prevent double execution in Strict Mode


  useEffect(() => {
    //  Only run once, even in StrictMode
    if (hasRun.current) return;
    hasRun.current = true;
    
    handleCallback();
  });

  const handleCallback = async () => {
    try {
      // Get authorization code from URL query params
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('Callback params:', { code, error, errorDescription });

      // Handle OAuth errors from Cognito
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setError(errorDescription || error);
        setStatus('error');
        return;
      }

      // Validate authorization code exists
      if (!code) {
        setError('No authorization code received from Cognito');
        setStatus('error');
        return;
      }

      console.log('Exchanging authorization code for tokens...');
      
      // Exchange authorization code for JWT tokens
      const tokens = await exchangeCodeForTokens(code);
      
      console.log('Token exchange successful:', {
        hasAccessToken: !!tokens.access_token,
        hasIdToken: !!tokens.id_token,
        hasRefreshToken: !!tokens.refresh_token,
      });

      // Store tokens in localStorage for authenticated requests
      localStorage.setItem('accessToken', tokens.access_token);
      localStorage.setItem('idToken', tokens.id_token);
      localStorage.setItem('refreshToken', tokens.refresh_token);

      // Decode ID token to extract user information
      const userInfo = parseJwt(tokens.id_token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      console.log('User authenticated:', {
        email: userInfo.email,
        sub: userInfo.sub,
      });

      setStatus('success');

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Callback processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  /**
   * Exchange authorization code for JWT tokens
   * Uses OAuth 2.0 token endpoint
   */
  const exchangeCodeForTokens = async (code: string) => {
    // Cognito token endpoint
    const tokenEndpoint = `https://${cognitoConfig.oauth.domain}/oauth2/token`;

    // OAuth 2.0 token request parameters
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: cognitoConfig.userPoolClientId,
      code: code,
      redirect_uri: cognitoConfig.oauth.redirectSignIn,
    });

    console.log('Token request to:', tokenEndpoint);

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token exchange failed:', errorData);
      throw new Error(
        errorData.error_description || 
        `Token exchange failed with status ${response.status}`
      );
    }

    return await response.json();
  };

  /**
   * Decode JWT token (Base64 decode, no signature verification)
   * Returns the payload containing user information
   */
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse JWT:', e);
      return {};
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
      }}>
        {status === 'loading' && (
          <>
            <div className="spinner" />
            <h2 style={{ color: '#2d3748', marginBottom: '10px', marginTop: '20px' }}>
              Processing Login...
            </h2>
            <p style={{ color: '#718096' }}>
              Exchanging authorization code for tokens
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#2d3748', marginBottom: '10px' }}>
              Login Successful!
            </h2>
            <p style={{ color: '#718096' }}>
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#2d3748', marginBottom: '10px' }}>
              Authentication Failed
            </h2>
            <p style={{ 
              color: '#e53e3e', 
              marginBottom: '20px',
              padding: '15px',
              background: '#fee',
              borderRadius: '6px',
              fontSize: '14px',
            }}>
              {error}
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              Back to Home
            </button>
          </>
        )}
      </div>

      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}