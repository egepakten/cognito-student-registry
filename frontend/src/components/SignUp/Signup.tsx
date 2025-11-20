/**
 * Sign Up Component
 * 
 * Two-step registration process:
 * Step 1: Enter Details (SignupDetailsForm)
 * Step 2: Verify Email (SignupVerificationForm)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, verifyEmail, resendVerificationCode } from '../../services/cognitoService';
import SignupDetailsForm from './SignupDetailsForm';
import SignupVerificationForm from './SignupVerificationForm';
import { CognitoError, SignupStep } from '../../types/cognitoService.types';
import '../../styles/signup.css';

export default function Signup() {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // UI state
  const [step, setStep] = useState<SignupStep>('details');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signUp({ email, password, name });
      console.log('✅ Signup successful:', result);
      
      setStep('verification');
      setSuccessMessage(`Verification code sent to ${email}`);
    } catch (err) {
      const cognitoError = err as CognitoError;
      
      if (cognitoError.code === 'UsernameExistsException') {
        setError('This email is already registered. Please login instead.');
      } else if (cognitoError.code === 'InvalidPasswordException') {
        setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
      } else if (cognitoError.code === 'InvalidParameterException') {
        setError('Invalid email format or password requirements not met.');
      } else {
        setError(cognitoError.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyEmail(email, verificationCode);
      console.log('✅ Email verified successfully');
      
      setSuccessMessage('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const cognitoError = err as CognitoError;
      
      if (cognitoError.code === 'CodeMismatchException') {
        setError('Invalid verification code. Please check and try again.');
      } else if (cognitoError.code === 'ExpiredCodeException') {
        setError('Verification code expired. Please request a new code.');
      } else if (cognitoError.code === 'NotAuthorizedException') {
        setError('User already confirmed. Please login.');
      } else {
        setError(cognitoError.message || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await resendVerificationCode(email);
      setSuccessMessage('New verification code sent to your email!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const cognitoError = err as CognitoError;
      setError(cognitoError.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="signup-container">
    <div className="signup-card">
      {/* Header */}
      <h2 className="signup-title">
        {step === 'details' ? '🎓 Create Account' : '✉️ Verify Email'}
      </h2>
      
      <p className="signup-subtitle">
        {step === 'details' 
          ? 'Join WiseUni Student Portal' 
          : `We sent a code to ${email}`
        }
      </p>

      {/* Details Form */}
      {step === 'details' && (
        <SignupDetailsForm
          name={name}
          email={email}
          password={password}
          error={error}
          loading={loading}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSignup}
        />
      )}

      {/* Verification Form */}
      {step === 'verification' && (
        <SignupVerificationForm
          verificationCode={verificationCode}
          error={error}
          successMessage={successMessage}
          loading={loading}
          onCodeChange={setVerificationCode}
          onSubmit={handleVerify}
          onResendCode={handleResendCode}
        />
      )}

      {/* Footer Links */}
      <div className="signup-footer">
        <p className="signup-footer-text">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="signup-link-button"
          >
            Login
          </button>
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="signup-back-button"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  </div>
);
}
