// frontend/src/pages/Home.tsx
/**
 * Home/Demo Page
 * 
 * Shows Cognito configuration and Hosted UI integration demo
 * This is your current App.tsx content - just moved here
 */

import { useState } from 'react';
import { cognitoConfig, getHostedUIUrls } from '../config/cognito';
import '../styles/global.css';

export default function Home() {
  const [showConfig, setShowConfig] = useState(false);
  const hostedUIUrls = getHostedUIUrls();

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>🎓 WiseUni Student Registry</h1>
          <p>AWS Cognito Integration Demo</p>
        </header>

        {/* Configuration Toggle */}
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="config-toggle"
        >
          {showConfig ? 'Hide' : 'Show'} Configuration
        </button>

        {/* Configuration Display */}
        {showConfig && (
          <div className="config-display">
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

        {/* Hosted UI Section */}
        <div className="hosted-ui-section">
          <h2>🔐 Hosted UI Login</h2>
          <p className="description">Test your Cognito Hosted UI:</p>
          
          <div className="button-group">
            <a 
              href={hostedUIUrls.login}
              className="button primary"
            >
              Login with Hosted UI
            </a>
            
            <a 
              href={hostedUIUrls.signup}
              className="button secondary"
            >
              Sign Up
            </a>
          </div>

          <div className="info-box">
            <p><strong>Note:</strong> This will open Cognito's Hosted UI in a new tab.</p>
            <p>After login, you'll be redirected to: <code>http://localhost:5173/callback</code></p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h2>📋 Next Steps</h2>
          <div className="step">
            <span className="check">✅</span>
            <span>Backend deployed successfully</span>
          </div>
          <div className="step">
            <span className="check">✅</span>
            <span>Frontend configuration loaded</span>
          </div>
          <div className="step">
            <span className="check">⬜</span>
            <span>Customize Hosted UI (AWS Console)</span>
          </div>
          <div className="step">
            <span className="check">⬜</span>
            <span>Set up Amazon SES for emails</span>
          </div>
          <div className="step">
            <span className="check">⬜</span>
            <span>Test user signup and login</span>
          </div>
          <div className="step">
            <span className="check">⬜</span>
            <span>Build frontend components</span>
          </div>
        </div>
      </div>
    </div>
  );
}