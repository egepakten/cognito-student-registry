// ============================================================================
// FORGOT PASSWORD - Request Code
// ============================================================================

/**
 * Request password reset code
 * 
 * What happens:
 * 1. User enters email
 * 2. Cognito sends reset code to email
 * 3. User must call confirmPassword() with code
 * 
 * Parameters:
 * - email: User's email address
 * 
 * Flow:
 * forgotPassword(email) → Email sent
 * → User receives code
 * → confirmPassword(email, code, newPassword)
 */
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';
export const forgotPassword = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        console.log('✅ Password reset code sent:', data);
        resolve();
      },
      onFailure: (err) => {
        console.error('❌ Forgot password error:', err);
        reject(err);
      },
    });
  });
};

// ============================================================================
// FORGOT PASSWORD - Confirm New Password
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
 */
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