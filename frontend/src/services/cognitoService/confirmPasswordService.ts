// ============================================================================
// FORGOT PASSWORD - Step 2: Confirm New Password
// ============================================================================

/**
 * Complete password reset with code
 * 
 * What happens:
 * 1. User enters code from email
 * 2. User enters new password
 * 3. Cognito validates code
 * 4. If valid: Password updated
 * 5. User can login with new password
 * 
 * Parameters:
 * - email: User's email
 * - code: Reset code from email
 * - newPassword: New password (must meet policy)
 * 
 * Errors:
 * - CodeMismatchException: Wrong code
 * - ExpiredCodeException: Code expired
 * - InvalidPasswordException: Password doesn't meet requirements
 */
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';
export const confirmPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        console.log('✅ Password reset successful');
        resolve();
      },
      onFailure: (err) => {
        console.error('❌ Confirm password error:', err);
        reject(err);
      },
    });
  });
};