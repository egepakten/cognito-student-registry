// frontend/src/pages/Home.tsx
/**
 * Home/Demo Page
 * 
 * Shows both authentication options:
 * 1. Hosted UI (AWS-managed pages)
 * 2. Custom Forms (Your own UI)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { cognitoConfig, getHostedUIUrls } from '../config/cognito';
import '../styles/global.css';

export default function Home() {
  const navigate = useNavigate(); // ✅ ADD THIS
  const [showDescription, setShowDescription] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isClosingDescription, setIsClosingDescription] = useState(false);
  const [isClosingConfig, setIsClosingConfig] = useState(false);
  const hostedUIUrls = getHostedUIUrls();

  const handleDescriptionToggle = () => {
    if (showDescription) {
      setIsClosingDescription(true);
      setTimeout(() => {
        setShowDescription(false);
        setIsClosingDescription(false);
      }, 300);
    } else {
      setShowDescription(true);
    }
  };

  const handleConfigToggle = () => {
    if (showConfig) {
      setIsClosingConfig(true);
      setTimeout(() => {
        setShowConfig(false);
        setIsClosingConfig(false);
      }, 300);
    } else {
      setShowConfig(true);
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>🎓 WiseUni Student Registry</h1>
          <p>AWS Cognito Integration Demo</p>
        </header>

        {/* Description Toggle */}
        <button 
          onClick={handleDescriptionToggle}
          className="description-toggle"
        >
          {showDescription ? 'Hide' : 'Show'} Project Description
        </button>

        {/* Description Display */}
        {(showDescription || isClosingDescription) && (
          <div className={`description-display ${isClosingDescription ? 'closing' : ''}`}>
            <h2>📚 About This Project</h2>
            <p>
              This project is a comprehensive learning demonstration of AWS Cognito integration. 
              The purpose is to explore and showcase knowledge of Cognito's authentication and 
              authorization capabilities through a practical student registry application.
            </p>
            <p>
              The application implements a role-based access control system where different user 
              types have distinct interfaces and permissions:
            </p>
            <ul>
              <li><strong>Students:</strong> Have access to their own student dashboard with 
              personalized views and limited permissions.</li>
              <li><strong>Professors:</strong> Have access to a professor dashboard with 
              enhanced permissions for managing courses and student data.</li>
              <li><strong>Guest Access:</strong> Provides limited read-only access for 
              unauthenticated users to explore public information.</li>
            </ul>
            <p>
              This implementation demonstrates various Cognito features including user pools, 
              identity pools, hosted UI, custom authentication flows, role-based access control, 
              and integration with AWS services like S3 and DynamoDB.
            </p>
          </div>
        )}

        {/* Configuration Toggle */}
        <button 
          onClick={handleConfigToggle}
          className="config-toggle"
        >
          {showConfig ? 'Hide' : 'Show'} Configuration
        </button>

        {/* Configuration Display */}
        {(showConfig || isClosingConfig) && (
          <div className={`config-display ${isClosingConfig ? 'closing' : ''}`}>
            <h2>📋 AWS Configuration</h2>
            
            <div className="config-section">
              <h3>User Pool</h3>
              <div className="config-item">
                <span className="label">Region:</span>
                <span className="value">{cognitoConfig.region}</span>
              </div>
              <div className="config-item">
                <span className="label">User Pool ID:</span>
                <span className="value">{cognitoConfig.userPoolId}</span>
              </div>
              <div className="config-item">
                <span className="label">Client ID:</span>
                <span className="value">{cognitoConfig.userPoolClientId}</span>
              </div>
              <div className="config-item">
                <span className="label">Domain:</span>
                <span className="value">{cognitoConfig.userPoolDomain}</span>
              </div>
            </div>

            <div className="config-section">
              <h3>Identity Pool</h3>
              <div className="config-item">
                <span className="label">Identity Pool ID:</span>
                <span className="value">{cognitoConfig.identityPoolId}</span>
              </div>
            </div>

            <div className="config-section">
              <h3>Resources</h3>
              <div className="config-item">
                <span className="label">S3 Bucket:</span>
                <span className="value">{cognitoConfig.homeworkBucket}</span>
              </div>
              <div className="config-item">
                <span className="label">DynamoDB Table:</span>
                <span className="value">{cognitoConfig.gradesTable}</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            AUTHENTICATION OPTIONS SECTION
            ============================================================ */}
        
        <div className="auth-options-container">
          <h2 style={{ 
            textAlign: 'center', 
            color: '#2d3748', 
            marginBottom: '30px',
            fontSize: '24px',
          }}>
            Choose Your Authentication Method
          </h2>

          {/* ============================================================
              OPTION 1: HOSTED UI (AWS-MANAGED)
              ============================================================ */}
          
          <div className="hosted-ui-section">
            <h2>🔐 Option 1: Hosted UI Login</h2>
            <p className="description">
              Use AWS Cognito's pre-built authentication pages (managed by AWS)
            </p>
            
            <div className="button-group">
              <a 
                href={hostedUIUrls.login}
                className="button primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Login with Hosted UI
              </a>
              
              <a 
                href={hostedUIUrls.signup}
                className="button secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign Up with Hosted UI
              </a>
            </div>

            <div className="info-box">
              <p><strong>✨ Features:</strong></p>
              <ul style={{ 
                marginTop: '8px', 
                marginLeft: '20px',
                fontSize: '13px',
              }}>
                <li>AWS-managed UI (no custom code needed)</li>
                <li>Built-in security best practices</li>
                <li>Automatic updates and maintenance</li>
                <li>Supports MFA, social login, SAML</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <strong>Note:</strong> Opens in new tab, redirects to{' '}
                <code>http://localhost:5173/callback</code>
              </p>
            </div>
          </div>

          {/* ============================================================
              DIVIDER
              ============================================================ */}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '40px 0',
            padding: '0 30px',
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: '#e2e8f0',
            }} />
            <span style={{
              padding: '0 20px',
              color: '#a0aec0',
              fontWeight: 600,
              fontSize: '14px',
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: '#e2e8f0',
            }} />
          </div>

          {/* ============================================================
              OPTION 2: CUSTOM FORMS (YOUR OWN UI)
              ============================================================ */}
          
          <div className="custom-auth-section">
            <h2>🎨 Option 2: Custom Authentication</h2>
            <p className="description">
              Use custom-built forms with full control over UI/UX (your own design)
            </p>
            
            <div className="button-group">
              <button 
                onClick={() => navigate('/login')}
                className="button primary"
              >
                Custom Login
              </button>
              
              <button 
                onClick={() => navigate('/signup')}
                className="button secondary"
              >
                Custom Sign Up
              </button>
            </div>

            <div className="info-box">
              <p><strong>✨ Features:</strong></p>
              <ul style={{ 
                marginTop: '8px', 
                marginLeft: '20px',
                fontSize: '13px',
              }}>
                <li>Full control over UI/UX design</li>
                <li>Custom branding and styling</li>
                <li>Email verification with OTP</li>
                <li>Forgot password flow</li>
                <li>Direct Cognito SDK integration</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <strong>Note:</strong> Uses <code>amazon-cognito-identity-js</code> SDK
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            COMPARISON TABLE (OPTIONAL)
            ============================================================ */}
        
        <div className="comparison-section">
          <h2 style={{ 
            textAlign: 'center', 
            color: '#2d3748', 
            marginBottom: '20px',
            fontSize: '22px',
          }}>
            📊 Quick Comparison
          </h2>
          
          <div style={{
            overflowX: 'auto',
            margin: '0 30px',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left',
                    borderBottom: '2px solid #e2e8f0',
                  }}>
                    Feature
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '2px solid #e2e8f0',
                  }}>
                    Hosted UI
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '2px solid #e2e8f0',
                  }}>
                    Custom Forms
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    Setup Complexity
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#38a169',
                  }}>
                    ✅ Low
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#d69e2e',
                  }}>
                    ⚠️ Medium
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    UI Customization
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#d69e2e',
                  }}>
                    ⚠️ Limited
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#38a169',
                  }}>
                    ✅ Full Control
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    Maintenance
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#38a169',
                  }}>
                    ✅ AWS Managed
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#d69e2e',
                  }}>
                    ⚠️ Your Responsibility
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    Learning Value
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#d69e2e',
                  }}>
                    ⚠️ Limited
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#38a169',
                  }}>
                    ✅ Deep Understanding
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                    Production Ready
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#38a169',
                  }}>
                    ✅ Yes
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#38a169',
                  }}>
                    ✅ Yes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}