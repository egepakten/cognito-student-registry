import React from 'react';

interface SignupDetailsFormProps {
  name: string;
  email: string;
  password: string;
  error: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignupDetailsForm({
  name,
  email,
  password,
  error,
  loading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: SignupDetailsFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {/* Name Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: '#4a5568',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          Full Name
        </label>
        <input
          type="text"
          placeholder="John Smith"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        />
      </div>
      
      {/* Email Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: '#4a5568',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        />
      </div>
      
      {/* Password Input */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: '#4a5568',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          minLength={8}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '16px',
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
        }}>
          Must include uppercase, lowercase, number, and special character
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
      
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#a0aec0' : '#667eea',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px',
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? '⏳ Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}