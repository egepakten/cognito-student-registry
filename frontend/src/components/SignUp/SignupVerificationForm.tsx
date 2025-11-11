import React from 'react';

interface SignupVerificationFormProps {
  verificationCode: string;
  error: string;
  successMessage: string;
  loading: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResendCode: () => void;
}

export default function SignupVerificationForm({
  verificationCode,
  error,
  successMessage,
  loading,
  onCodeChange,
  onSubmit,
  onResendCode,
}: SignupVerificationFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {/* Success Message */}
      {successMessage && !error && (
        <div style={{
          background: '#f0fff4',
          color: '#38a169',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          border: '1px solid #9ae6b4',
        }}>
          ✅ {successMessage}
        </div>
      )}
      
      {/* Code Input */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: '#4a5568',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          Verification Code
        </label>
        <input
          type="text"
          placeholder="000000"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only digits
            if (value.length <= 6) {
              onCodeChange(value);
            }
          }}
          required
          maxLength={6}
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '24px',
            letterSpacing: '12px',
            textAlign: 'center',
            fontWeight: 700,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        />
        <p style={{ 
          fontSize: '12px', 
          color: '#718096', 
          marginTop: '5px',
          textAlign: 'center',
        }}>
          Check your email for the 6-digit code
        </p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fee',
          color: '#e53e3e',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          border: '1px solid #feb2b2',
        }}>
          ❌ {error}
        </div>
      )}
      
      {/* Verify Button */}
      <button 
        type="submit" 
        disabled={loading || verificationCode.length !== 6}
        style={{
          width: '100%',
          background: (loading || verificationCode.length !== 6) ? '#a0aec0' : '#667eea',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: (loading || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
          marginBottom: '15px',
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? '⏳ Verifying...' : 'Verify Email'}
      </button>
      
      {/* Resend Button */}
      <button
        type="button"
        onClick={onResendCode}
        disabled={loading}
        style={{
          width: '100%',
          background: 'transparent',
          color: '#667eea',
          border: '2px solid #667eea',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        📧 Resend Code
      </button>
    </form>
  );
}