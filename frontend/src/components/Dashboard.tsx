// frontend/src/components/Dashboard.tsx
/**
 * Main Dashboard Component
 * Displays after successful login
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostedUIUrls } from '../config/cognito';
import { CognitoUserInfo } from '../types/user.types';

// ✅ IMPORTANT: Must be 'export default'
export default function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<CognitoUserInfo | null>(null); 

  useEffect(() => {
    // Check authentication
    const idToken = localStorage.getItem('idToken');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (!idToken) {
      navigate('/');
      return;
    }

    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    const hostedUIUrls = getHostedUIUrls();
    window.location.href = hostedUIUrls.logout;
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
      }}>
        <h1>🎓 WiseUni Dashboard</h1>
        <p>Welcome, {userInfo.email}!</p>
        
        <button onClick={handleLogout}>Logout</button>
        
        <div style={{ marginTop: '30px' }}>
          <h2>Quick Links</h2>
          <button onClick={() => navigate('/upload')}>Upload Homework</button>
          <button onClick={() => navigate('/grades')}>View Grades</button>
        </div>
      </div>
    </div>
  );
}