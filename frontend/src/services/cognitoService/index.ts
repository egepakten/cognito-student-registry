/**
 * Cognito Authentication Service
 * 
 * This service handles all AWS Cognito operations using amazon-cognito-identity-js
 * 
 * Functions:
 * - signUp(): Create new user account
 * - verifyEmail(): Verify email with OTP code
 * - resendVerificationCode(): Resend OTP if user didn't receive it
 * - signIn(): Authenticate user and get JWT tokens
 * - forgotPassword(): Request password reset code
 * - confirmPassword(): Complete password reset with code
 * - changePassword(): Change password for logged-in user
 * - signOut(): Sign out and clear session
 * - getCurrentUser(): Get currently logged-in user
 * - getUserAttributes(): Get user attributes
 * - getSession(): Get current valid session
 * - getAccessToken(): Get access token
 * - getIdToken(): Get ID token
 * - getRefreshToken(): Get refresh token
 * 
 * Flow Explanation:
 * 
 * 1. SIGNUP FLOW:
 *    User → signUp() → Cognito creates user (UNCONFIRMED)
 *    → Cognito sends OTP email → verifyEmail() → User CONFIRMED
 * 
 * 2. LOGIN FLOW:
 *    User → signIn() → Cognito validates credentials
 *    → Returns JWT tokens (access, id, refresh)
 * 
 * 3. FORGOT PASSWORD FLOW:
 *    User → forgotPassword() → Cognito sends reset code
 *    → User enters code + new password → confirmPassword()
 */

// Authentication
export { signUp } from './signUpService';
export { signIn } from './signInService';
export { 
  getCurrentUser, 
  getUserAttributes,
} from './authService';
export { signOut } from './signOutService';

// Email verification
export { 
  verifyEmail, 
  resendVerificationCode 
} from './verifyEmailService';

// Password management
export { 
  forgotPassword, 
  confirmPassword, 
  changePassword 
} from './resetPasswordService';

// Token management
export { 
  getSession,
  getAccessToken,
  getIdToken,
  getRefreshToken
} from './tokenService';

// Re-export types
export type { 
  SignUpParams, 
  LoginParams,
  AuthTokens 
} from '../../types/cognitoService.types';
