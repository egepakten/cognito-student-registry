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
              identity pools, hosted UI, role-based access control, and integration with AWS 
              services like S3 and DynamoDB.
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


        
      </div>
    </div>
  );
}