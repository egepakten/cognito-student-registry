// ============================================================================
// LOGIN
// ============================================================================

/**
 * Authenticate user and get JWT tokens
 * 
 * What happens:
 * 1. Cognito validates email + password
 * 2. If valid: Returns session with 3 tokens
 *    - Access Token: For API authorization
 *    - ID Token: Contains user info
 *    - Refresh Token: Get new tokens when expired
 * 3. Tokens stored in localStorage
 * 4. User redirected to dashboard
 * 
 * Parameters:
 * - email: User's email
 * - password: User's password
 * 
 * Returns:
 * - AuthTokens object with all 3 tokens
 * 
 * Errors:
 * - NotAuthorizedException: Wrong password
 * - UserNotFoundException: Email not registered
 * - UserNotConfirmedException: Email not verified yet
 * - PasswordResetRequiredException: Must reset password
 */
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { AuthTokens, LoginParams } from '../../types/cognitoService.types';
import { userPool } from '../../config/cognito'; 
export const signIn = async ({ // ← RENAME from 'login' to 'signIn'
  email, 
  password 
}: LoginParams): Promise<AuthTokens> => {
  return new Promise((resolve, reject) => {
    // Create authentication details
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    // Create CognitoUser instance
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    // Authenticate user
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        console.log('✅ Login successful');
        
        // Extract tokens from session
        const tokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        };
        
        console.log('📝 Tokens received:', {
          accessToken: tokens.accessToken.substring(0, 20) + '...',
          idToken: tokens.idToken.substring(0, 20) + '...',
          refreshToken: tokens.refreshToken.substring(0, 20) + '...',
        });
        
        resolve(tokens);
      },
      
      onFailure: (err) => {
        console.error('❌ Login error:', err);
        reject(err);
      },
      
     
    });
  });
};