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

type SignupStep = 'details' | 'verification';

interface CognitoError {
  code?: string;
  message?: string;
  name?: string;
}

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

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Header */}
        <h2 style={{ 
          color: '#2d3748', 
          marginBottom: '10px',
          fontSize: '28px',
          fontWeight: 700,
        }}>
          {step === 'details' ? '🎓 Create Account' : '✉️ Verify Email'}
        </h2>
        
        <p style={{ 
          color: '#718096', 
          marginBottom: '30px',
          fontSize: '14px',
        }}>
          {step === 'details' 
            ? 'Join WiseUni Student Portal' 
            : `We sent a code to ${email}`
          }
        </p>

        {/* Step 1: Details Form */}
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

        {/* Step 2: Verification Form */}
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
        <div style={{ 
          marginTop: '25px', 
          paddingTop: '20px', 
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
        }}>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Login
            </button>
          </p>
          
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '10px',
              background: 'none',
              border: 'none',
              color: '#a0aec0',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
