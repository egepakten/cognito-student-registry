// frontend/src/pages/Home.tsx
/**
 * Home/Demo Page
 *
 * Mini project format:
 * - Title at top
 * - Two buttons side by side (Hide Info, Hide Configuration)
 * - Dropdowns for project info and configuration
 * - Liquid glass effect for hero section
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cognitoConfig, getHostedUIUrls } from "../config/cognito";
import "../styles/global.css";

export default function Home() {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isClosingDescription, setIsClosingDescription] = useState(false);
  const [isClosingConfig, setIsClosingConfig] = useState(false);
  const hostedUIUrls = getHostedUIUrls();

  const handleDescriptionToggle = () => {
    console.log("Description button clicked, current state:", showDescription);
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
    console.log("Config button clicked, current state:", showConfig);
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
        {/* Title at Top */}
        <header className="header">
          <h1>🎓 WiseUni Student Registry</h1>
          <p>AWS Cognito Integration Demo</p>
        </header>

        {/* Two Buttons Side by Side */}
        <div className="toggle-buttons-container">
          <button onClick={handleDescriptionToggle} className="toggle-button">
            {showDescription ? "Hide" : "Show"} Info
          </button>

          <button onClick={handleConfigToggle} className="toggle-button">
            {showConfig ? "Hide" : "Show"} Configuration
          </button>
        </div>

        {/* Description Display */}
        {(showDescription || isClosingDescription) && (
          <div
            className={`description-display ${
              isClosingDescription ? "closing" : ""
            }`}
          >
            <h2>📚 About This Project</h2>
            <p>
              This project is a comprehensive learning demonstration of AWS
              Cognito integration. The purpose is to explore and showcase
              knowledge of Cognito's authentication and authorization
              capabilities through a practical student registry application.
            </p>
            <p>
              The application implements a role-based access control system
              where different user types have distinct interfaces and
              permissions:
            </p>
            <ul>
              <li>
                <strong>Students:</strong> Have access to their own student
                dashboard with personalized views and limited permissions.
              </li>
              <li>
                <strong>Professors:</strong> Have access to a professor
                dashboard with enhanced permissions for managing courses and
                student data.
              </li>
              <li>
                <strong>Guest Access:</strong> Provides limited read-only access
                for unauthenticated users to explore public information.
              </li>
            </ul>
            <p>
              This implementation demonstrates various Cognito features
              including user pools, identity pools, hosted UI, custom
              authentication flows, role-based access control, and integration
              with AWS services like S3 and DynamoDB.
            </p>
          </div>
        )}

        {/* Configuration Display */}
        {(showConfig || isClosingConfig) && (
          <div className={`config-display ${isClosingConfig ? "closing" : ""}`}>
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

        {/* Hero Section with Liquid Glass Effect */}
        <div className="hero-section">
          <div className="liquid-glass-wrapper">
            <div className="hero-content">
              <h2 className="hero-title">Choose Your Authentication Method</h2>

              {/* Option 1: Hosted UI */}
              <div className="auth-option">
                <h3>🔐 Option 1: Hosted UI Login</h3>
                <p className="auth-description">
                  Use AWS Cognito's pre-built authentication pages (managed by
                  AWS)
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
                  <p>
                    <strong>✨ Features:</strong>
                  </p>
                  <ul>
                    <li>AWS-managed UI (no custom code needed)</li>
                    <li>Built-in security best practices</li>
                    <li>Automatic updates and maintenance</li>
                    <li>Supports MFA, social login, SAML</li>
                  </ul>
                  <p style={{ marginTop: "12px" }}>
                    <strong>Note:</strong> Opens in new tab, redirects to{" "}
                    <code>http://localhost:5173/callback</code>
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="divider">
                <span>OR</span>
              </div>

              {/* Option 2: Custom Authentication */}
              <div className="auth-option">
                <h3>🎨 Option 2: Custom Authentication</h3>
                <p className="auth-description">
                  Use custom-built forms with full control over UI/UX (your own
                  design)
                </p>

                <div className="button-group">
                  <button
                    onClick={() => navigate("/login")}
                    className="button primary"
                  >
                    Custom Login
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="button secondary"
                  >
                    Custom Sign Up
                  </button>
                </div>

                <div className="info-box">
                  <p>
                    <strong>✨ Features:</strong>
                  </p>
                  <ul>
                    <li>Full control over UI/UX design</li>
                    <li>Custom branding and styling</li>
                    <li>Email verification with OTP</li>
                    <li>Forgot password flow</li>
                    <li>Direct Cognito SDK integration</li>
                  </ul>
                  <p style={{ marginTop: "12px" }}>
                    <strong>Note:</strong> Uses{" "}
                    <code>amazon-cognito-identity-js</code> SDK
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
