import { CognitoUserPool } from "amazon-cognito-identity-js";

// Load environment variables
// VITE_ prefix is required for Vite to expose env vars to client
export const cognitoConfig = {
  // User Pool configuration
  region: import.meta.env.VITE_AWS_REGION,
  userPoolId: import.meta.env.VITE_USER_POOL_ID,
  userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  userPoolDomain: import.meta.env.VITE_USER_POOL_DOMAIN,

  // Identity Pool configuration
  identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,

  // OAuth/Hosted UI configuration
  oauth: {
    domain: `${import.meta.env.VITE_USER_POOL_DOMAIN}.auth.${
      import.meta.env.VITE_AWS_REGION
    }.amazoncognito.com`,
    scope: ["email", "openid", "profile"],
    redirectSignIn: import.meta.env.VITE_OAUTH_REDIRECT_URI,
    redirectSignOut: import.meta.env.VITE_OAUTH_LOGOUT_URI,
    responseType: "code",
  },

  //S3 configuration
  homeworkBucket: import.meta.env.VITE_HOMEWORK_BUCKET,

  // DynamoDB configuration
  gradesTable: import.meta.env.VITE_GRADES_TABLE,
};

// Validate configuration
const validateConfig = () => {
  const required = [
    "region",
    "userPoolId",
    "userPoolClientId",
    "identityPoolId",
    "homeworkBucket",
    "gradesTable",
  ];

  const missing = required.filter(
    (key) => !cognitoConfig[key as keyof typeof cognitoConfig]
  );

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    throw new Error(`Missing required config: ${missing.join(", ")}`);
  }
};

// Run validation
validateConfig();

// Create User Pool instance
export const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.userPoolClientId,
});

// Generate Hosted UI URLs
export const getHostedUIUrls = () => {
  const baseUrl = `https://${cognitoConfig.oauth.domain}`;
  const params = new URLSearchParams({
    client_id: cognitoConfig.userPoolClientId,
    response_type: cognitoConfig.oauth.responseType,
    scope: cognitoConfig.oauth.scope.join(" "),
    redirect_uri: cognitoConfig.oauth.redirectSignIn,
  });

  return {
    login: `${baseUrl}/login?${params.toString()}`,
    signup: `${baseUrl}/signup?${params.toString()}`,
    logout: `${baseUrl}/logout?${new URLSearchParams({
      client_id: cognitoConfig.userPoolClientId,
      logout_uri: cognitoConfig.oauth.redirectSignOut,
    }).toString()}`,
  };
};

// Log configuration (only in development)
if (import.meta.env.DEV) {
  console.log("Cognito Configuration:", {
    region: cognitoConfig.region,
    userPoolId: cognitoConfig.userPoolId,
    identityPoolId: cognitoConfig.identityPoolId,
    hostedUIUrls: getHostedUIUrls(),
  });
}
