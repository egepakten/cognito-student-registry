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
import { SignUpParams, LoginParams, AuthTokens } from '../../types/cognitoService.types';

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.userPoolClientId,
});

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


export const login = async ({ 
  email, 
  password 
}: LoginParams): Promise<AuthTokens> => {
    console.log('🔐 Login attempt:', {
    email,
    poolId: cognitoConfig.userPoolId,
    clientId: cognitoConfig.userPoolClientId,
  });
  
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    console.log('👤 Creating CognitoUser...');

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });


    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

    
    console.log('🔑 Authenticating...');

    console.log(cognitoUser);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        console.log('✅ Login successful');
        
        const tokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        };

        console.log('✅ Tokens received:', {
          hasAccessToken: !!tokens.accessToken,
          hasIdToken: !!tokens.idToken,
          hasRefreshToken: !!tokens.refreshToken,
        });
        
        resolve(tokens);
      },
      
      onFailure: (err) => {
        console.error('❌ Login error:', err);
        console.error('❌ Error details:', {
          code: err.code,
          name: err.name,
          message: err.message,
        });
        reject(err);
      },
    });
  });
};


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

export const logout = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  
  if (cognitoUser) {
    cognitoUser.signOut();
    console.log('✅ User signed out');
  }
  
  localStorage.clear();
};


export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};