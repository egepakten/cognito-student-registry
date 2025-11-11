

/**
 * Verify email address with OTP code
 * 
 * What happens:
 * 1. User receives 6-digit code via email
 * 2. User enters code in your app
 * 3. This function validates code with Cognito
 * 4. If valid: User status changes to CONFIRMED
 * 5. Post-confirmation Lambda triggers (sends welcome email)
 * 
 * Parameters:
 * - email: User's email address
 * - code: 6-digit verification code from email
 * 
 * Errors:
 * - CodeMismatchException: Wrong code entered
 * - ExpiredCodeException: Code expired (valid 24 hours)
 * - NotAuthorizedException: User already confirmed
 */
import {
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';
export const verifyEmail = async (
  email: string, 
  code: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Create CognitoUser instance
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    // Call confirmRegistration API
    cognitoUser.confirmRegistration(
      code,  // Verification code
      true,  // Force alias creation (use email as alias)
      (err, result) => {
        if (err) {
          console.error('❌ Verification error:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Email verified:', result);
        resolve();
      }
    );
  });
};

/**
 * Resend verification code to user's email
 * 
 * Use cases:
 * - User didn't receive original email
 * - Verification code expired (after 24 hours)
 * - User accidentally deleted the email
 * 
 * What happens:
 * 1. Cognito generates new 6-digit code
 * 2. Sends new verification email
 * 3. Old code becomes invalid
 * 
 * Parameters:
 * - email: User's email address
 * 
 * Errors:
 * - UserNotFoundException: Email not registered
 * - InvalidParameterException: User already confirmed
 * - LimitExceededException: Too many requests (rate limit)
 */
export const resendVerificationCode = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        console.error('❌ Resend code error:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Verification code resent:', result);
      resolve();
    });
  });
};