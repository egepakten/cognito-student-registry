
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
