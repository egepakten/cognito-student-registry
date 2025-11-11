// ============================================================================
// CHANGE PASSWORD (for logged-in users)
// ============================================================================

/**
 * Change password for authenticated user
 * 
 * What happens:
 * 1. User must be logged in
 * 2. User enters old password + new password
 * 3. Cognito validates old password
 * 4. If valid: Updates to new password
 * 
 * Use case:
 * - User wants to change password from settings
 * - Different from "forgot password" (requires old password)
 * 
 * Parameters:
 * - oldPassword: Current password
 * - newPassword: New password
 * 
 * Errors:
 * - NotAuthorizedException: Wrong old password or not logged in
 * - InvalidPasswordException: New password doesn't meet requirements
 * - LimitExceededException: Too many attempts
 */
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
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

      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          console.error('❌ Change password error:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Password changed:', result);
        resolve();
      });
    });
  });
};