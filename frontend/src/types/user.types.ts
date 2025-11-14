/**
 * User types from Cognito JWT tokens
 */

export interface CognitoUserInfo {
  sub: string;                    // User ID (UUID)
  email: string;                  // User email
  email_verified: boolean;        // Email verification status
  name?: string;                  // User's name (optional)
  'cognito:username'?: string;    // Cognito username
  'cognito:groups'?: string[];    // User groups (if any)
  iat?: number;                   // Issued at (timestamp)
  exp?: number;                   // Expiration (timestamp)
  auth_time?: number;             // Authentication time
  token_use?: string;             // Token type (id/access)
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}