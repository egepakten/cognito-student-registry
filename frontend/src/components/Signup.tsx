// frontend/src/components/Signup.tsx
/**
 * Custom Signup Component
 * Alternative to Hosted UI
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ IMPORTANT: Must be 'export default'
export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement custom signup with Cognito SDK
      console.log('Signup with:', { email, password, name });
      
      // Placeholder - will implement in Part 2
      alert('Custom signup will be implemented in Part 2');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
        <h2>Create Account</h2>
        
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}>Login</button>
        </p>
        
        <p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </p>
      </div>
    </div>
  );
}