/**
 * Authentication Service
 * 
 * Central authentication logic using amazon-cognito-identity-js
 * All Cognito operations are handled here
 */

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { cognitoConfig } from '../../config/cognito';

// ============================================================================
// USER POOL INSTANCE
// ============================================================================

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.userPoolClientId,
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

// ============================================================================
// SIGN UP
// ============================================================================

export const signUp = async ({ 
  email, 
  password, 
  name 
}: SignUpParams): Promise<ISignUpResult> => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        console.error('❌ Signup error:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Signup successful:', result?.userSub);
      resolve(result!);
    });
  });
};

// ============================================================================
// VERIFY EMAIL
// ============================================================================

export const verifyEmail = async (
  email: string, 
  code: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        console.error('❌ Verification error:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Email verified');
      resolve();
    });
  });
};

// ============================================================================
// LOGIN
// ============================================================================

export const login = async ({ 
  email, 
  password 
}: LoginParams): Promise<AuthTokens> => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        console.log('✅ Login successful');
        
        const tokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        };
        
        resolve(tokens);
      },
      
      onFailure: (err) => {
        console.error('❌ Login error:', err);
        reject(err);
      },
    });
  });
};

// ============================================================================
// RESEND VERIFICATION CODE
// ============================================================================

export const resendVerificationCode = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        console.error('❌ Resend code error:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Verification code resent');
      resolve();
    });
  });
};

// ============================================================================
// FORGOT PASSWORD
// ============================================================================

export const forgotPassword = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        console.log('✅ Password reset code sent');
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
// CONFIRM PASSWORD RESET
// ============================================================================

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
// LOGOUT
// ============================================================================

export const logout = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  
  if (cognitoUser) {
    cognitoUser.signOut();
    console.log('✅ User signed out');
  }
  
  localStorage.clear();
};

// ============================================================================
// GET CURRENT USER
// ============================================================================

export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};