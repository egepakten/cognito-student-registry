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

export interface UserInfo {
  sub: string;                    // User ID (UUID)
  email: string;                  // Email address
  email_verified: boolean;        // Email verified?
  name?: string;                  // User's name
  'cognito:username'?: string;    // Cognito username
}
