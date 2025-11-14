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
  
} from './authService';