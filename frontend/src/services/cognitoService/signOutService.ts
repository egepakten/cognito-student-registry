
/**
 * Sign out current user
 * 
 * What happens:
 * 1. Clears Cognito session
 * 2. Removes tokens from localStorage
 * 3. User redirected to login
 * 
 * Use case:
 * - User clicks "Logout" button
 */
import { userPool } from '../../config/cognito';

export const signOut = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  
  if (cognitoUser) {
    cognitoUser.signOut();
    console.log('✅ User signed out');
  }
  
  // Clear tokens from localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};