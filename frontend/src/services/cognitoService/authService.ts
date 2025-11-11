// ============================================================================
// GET CURRENT USER
// ============================================================================

/**
 * Get currently logged-in user
 * 
 * What happens:
 * 1. Checks localStorage for session
 * 2. Returns CognitoUser if logged in
 * 3. Returns null if not logged in
 * 
 * Returns:
 * - CognitoUser object or null
 * 
 * Use case:
 * - Check if user is logged in
 * - Get user to perform operations
 */
import { CognitoUser, CognitoUserAttribute, CognitoUserSession } from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';

export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

/**
 * Get user attributes (email, name, etc.)
 * 
 * What happens:
 * 1. Gets current user
 * 2. Fetches user attributes from Cognito
 * 3. Returns as key-value object
 * 
 * Returns:
 * - Object with user attributes
 * 
 * Example:
 * {
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   sub: 'user-id-123'
 * }
 */
export const getUserAttributes = async (): Promise<Record<string, string>> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
      reject(new Error('No user logged in'));
      return;
    }

    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        reject(err || new Error('No valid session'));
        return;
      }

      cognitoUser.getUserAttributes((err: Error | undefined, attributes?: CognitoUserAttribute[]) => {
        if (err) {
          reject(err);
          return;
        }

        // Convert array of attributes to object
        const attributesObj: Record<string, string> = {};
        attributes?.forEach((attr: CognitoUserAttribute) => {
          attributesObj[attr.getName()] = attr.getValue();
        });

        resolve(attributesObj);
      });
    });
  });
};

