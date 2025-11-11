

// ============================================================================
// FORGOT PASSWORD - Step 1: Request Code
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
import { CognitoUser } from 'amazon-cognito-identity-js';
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