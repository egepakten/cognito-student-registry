/**
 * Get current valid session
 * 
 * What happens:
 * 1. Gets current user
 * 2. Validates session (checks token expiration)
 * 3. Auto-refreshes if expired (using refresh token)
 * 4. Returns valid session
 * 
 * Returns:
 * - CognitoUserSession with valid tokens
 * 
 * Use case:
 * - Before making API calls
 * - Check if user is still authenticated
 * - Auto-refresh expired tokens
 */
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';

export const getSession = async (): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
      reject(new Error('No user logged in'));
      return;
    }

    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        reject(err || new Error('No valid session'));
        return;
      }

      if (!session.isValid()) {
        reject(new Error('Session expired'));
        return;
      }

      resolve(session);
    });
  });
};

/**
 * Get access token from current session
 * 
 * Returns:
 * - JWT access token string
 * 
 * Use case:
 * - Send with API requests for authorization
 */
export const getAccessToken = async (): Promise<string> => {
  const session = await getSession();
  return session.getAccessToken().getJwtToken();
};

/**
 * Get ID token from current session
 * 
 * Returns:
 * - JWT ID token string (contains user info)
 * 
 * Use case:
 * - Extract user information (email, name, etc.)
 */
export const getIdToken = async (): Promise<string> => {
  const session = await getSession();
  return session.getIdToken().getJwtToken();
};

/**
 * Get refresh token from current session
 * 
 * Returns:
 * - Refresh token string
 * 
 * Use case:
 * - Get new access/ID tokens when they expire
 */
export const getRefreshToken = async (): Promise<string> => {
  const session = await getSession();
  return session.getRefreshToken().getToken();
};