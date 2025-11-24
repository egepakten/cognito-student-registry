/**
   * Exchange authorization code for JWT tokens
   * Uses OAuth 2.0 token endpoint
   */
import { cognitoConfig } from '../../config/cognito';
export const exchangeCodeForTokens = async (code: string) => {
    // Cognito token endpoint
    const tokenEndpoint = `https://${cognitoConfig.oauth.domain}/oauth2/token`;

    // OAuth 2.0 token request parameters
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: cognitoConfig.userPoolClientId,
      code: code,
      redirect_uri: cognitoConfig.oauth.redirectSignIn,
    });

    console.log('Token request to:', tokenEndpoint);

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token exchange failed:', errorData);
      throw new Error(
        errorData.error_description || 
        `Token exchange failed with status ${response.status}`
      );
    }

    return await response.json();
  };