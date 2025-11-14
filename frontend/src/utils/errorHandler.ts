
 import { CognitoError } from '../types/cognitoService.types';
// Type guard to check if error is CognitoError
export function isCognitoError(error: unknown): error is CognitoError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}