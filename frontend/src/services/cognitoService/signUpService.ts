/**
 * Sign up a new user
 * 
 * What happens:
 * 1. Creates user in Cognito (status: UNCONFIRMED)
 * 2. Cognito sends verification email with OTP code
 * 3. User must call verifyEmail() to confirm account
 * 
 * Parameters:
 * - email: User's email address (used as username)
 * - password: Password (must meet Cognito password policy)
 * - name: User's full name
 * 
 * Returns:
 * - ISignUpResult with user info and confirmation status
 * 
 * Errors:
 * - UsernameExistsException: Email already registered
 * - InvalidPasswordException: Password doesn't meet requirements
 * - InvalidParameterException: Invalid email format
 */
import { SignUpParams } from '../../types/cognitoService.types';
import { 
  CognitoUserAttribute, 
  ISignUpResult 
} from 'amazon-cognito-identity-js';
import { userPool } from '../../config/cognito';
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

    userPool.signUp(
      email,
      password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          console.error('❌ Signup error:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Signup successful:', {
          userSub: result?.userSub,
          userConfirmed: result?.userConfirmed,
        });
        
        resolve(result!);
      }
    );
  });
};