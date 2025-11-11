// frontend/src/components/Login.tsx
/**
 * Custom Login Component
 * Alternative to Hosted UI
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement custom login with Cognito SDK
      console.log('Login with:', email, password);
      
      // Placeholder - will implement in Part 2
      alert('Custom login will be implemented in Part 2');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h2>Custom Login</h2>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </p>
        
        <p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </p>
      </div>
    </div>
  );
}