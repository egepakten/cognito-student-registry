export interface CognitoUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  "cognito:username"?: string;
  "cognito:groups"?: string[];
  iat?: number;
  exp?: number;
  auth_time?: number;
  token_use?: string;
}

export type SignupStep = "details" | "verification";

export interface CognitoError extends Error {
  code?: string;
  name: string;
  message: string;
}
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

export interface AuthContextValue {
  user: CognitoUserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  tokens: AuthTokens | null;
}

export interface AuthSession {
  user: CognitoUserInfo;
  tokens: AuthTokens; // Contains raw idToken, accessToken, refreshToken
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}
