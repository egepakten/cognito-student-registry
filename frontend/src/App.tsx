// src/App.tsx
// Simple test to verify configuration

import { useState } from 'react';
import { cognitoConfig, getHostedUIUrls } from './config/cognito';
import './styles/global.css';

function App() {
  const [showConfig, setShowConfig] = useState(false);
  const hostedUIUrls = getHostedUIUrls();

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🎓 WiseUni Student Portal</h1>
          <p className="subtitle">Cognito Learning Project</p>
        </header>

        <div className="card">
          <h2>✅ Configuration Loaded Successfully!</h2>
          
          <button 
            className="btn-primary"
            onClick={() => setShowConfig(!showConfig)}
          >
            {showConfig ? 'Hide' : 'Show'} Configuration
          </button>

          {showConfig && (
            <div className="config-display">
              <h3>AWS Configuration:</h3>
              <ul>
                <li><strong>Region:</strong> {cognitoConfig.region}</li>
                <li><strong>User Pool ID:</strong> {cognitoConfig.userPoolId}</li>
                <li><strong>Client ID:</strong> {cognitoConfig.userPoolClientId}</li>
                <li><strong>Identity Pool ID:</strong> {cognitoConfig.identityPoolId}</li>
                <li><strong>S3 Bucket:</strong> {cognitoConfig.homeworkBucket}</li>
                <li><strong>DynamoDB Table:</strong> {cognitoConfig.gradesTable}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="card">
          <h2>🔐 Hosted UI Login</h2>
          <p>Test your Cognito Hosted UI:</p>
          
          <div className="button-group">
            <a 
              href={hostedUIUrls.login} 
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Login with Hosted UI
            </a>
            
            <a 
              href={hostedUIUrls.signup} 
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign Up
            </a>
          </div>

          <div className="info-box">
            <p><strong>Note:</strong> This will open Cognito's Hosted UI in a new tab.</p>
            <p>After login, you'll be redirected to: <code>{cognitoConfig.oauth.redirectSignIn}</code></p>
          </div>
        </div>

        <div className="card">
          <h2>📋 Next Steps</h2>
          <ol className="steps-list">
            <li>✅ Backend deployed successfully</li>
            <li>✅ Frontend configuration loaded</li>
            <li>🔲 Customize Hosted UI (AWS Console)</li>
            <li>🔲 Set up Amazon SES for emails</li>
            <li>🔲 Test user signup and login</li>
            <li>🔲 Build frontend components</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;