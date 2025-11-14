// frontend/src/services/cognitoService/index.ts
/**
 * Cognito Service Entry Point
 * 
 * Exports all authentication functions
 * Import from here in components
 */

export {
  // Functions
  signUp,
  verifyEmail,
  resendVerificationCode,
  login,
  forgotPassword,
  confirmPassword,
  logout,
  getCurrentUser,
  
  // Types
  type SignUpParams,
  type LoginParams,
  type AuthTokens,
} from './authService';