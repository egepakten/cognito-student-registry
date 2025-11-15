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
      <header className="app-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="app-title">🎓 WiseUni Student Registry</h1>
            <p className="app-subtitle">AWS Cognito Integration Demo</p>
          </div>
          <div>
            <button className="info-toggle" onClick={handleDescriptionToggle}>
              {showDescription ? "Hide Info ▲" : "Show Info ▼"}
            </button>
          </div>
        </div>
      </header>

      <div className="toggle-buttons-container">
        <button className="toggle-button" onClick={handleConfigToggle}>
          {showConfig ? "Hide Configuration ▲" : "Show Configuration ▼"}
        </button>
      </div>

      <main className="main-content">
        {showDescription && (
          <section
            className={`info-box description-display ${
              isClosingDescription ? "closing" : ""
            }`}
          >
            <div className="info-content">
              <h3>About This Mini Project</h3>
              <p>
                This experience walks through everything I know about AWS
                Cognito—hosted UI flows, fully custom authentication, role-based
                authorisation, and integrations with S3 / DynamoDB. It mirrors
                what I previously built for Focalstreams, just focused on a
                student registry.
              </p>
              <div className="info-features">
                <div className="feature-item">
                  <span className="feature-icon">👩‍🎓</span>
                  <span>Students see their dashboard, uploads, grades</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👨‍🏫</span>
                  <span>Professors manage classes and grading actions</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👀</span>
                  <span>Guest view demonstrates unauthenticated access</span>
                </div>
              </div>
              <div className="powered-by">
                <h4>Powered by</h4>
                <div className="tech-stack">
                  <span className="tech-badge">AWS Cognito</span>
                  <span className="tech-badge">React + Vite</span>
                  <span className="tech-badge">DynamoDB</span>
                  <span className="tech-badge">Amazon S3</span>
                </div>
                <p className="tech-description">
                  Hosted UI for rapid demos, SDK-based flows for complete
                  control, identity pool roles for scoped access, and signed URL
                  uploads for homework.
                </p>
              </div>
            </div>
          </section>
        )}

        {(showConfig || isClosingConfig) && (
          <section
            className={`info-box config-display ${
              isClosingConfig ? "closing" : ""
            }`}
          >
            <div className="info-content">
              <h3>📋 AWS Configuration</h3>
              <div className="config-section">
                <h4>User Pool</h4>
                <div className="config-item">
                  <span className="label">Region</span>
                  <span className="value">{cognitoConfig.region}</span>
                </div>
                <div className="config-item">
                  <span className="label">User Pool ID</span>
                  <span className="value">{cognitoConfig.userPoolId}</span>
                </div>
                <div className="config-item">
                  <span className="label">Client ID</span>
                  <span className="value">
                    {cognitoConfig.userPoolClientId}
                  </span>
                </div>
                <div className="config-item">
                  <span className="label">Domain</span>
                  <span className="value">{cognitoConfig.userPoolDomain}</span>
                </div>
              </div>
              <div className="config-section">
                <h4>Identity Pool</h4>
                <div className="config-item">
                  <span className="label">Pool ID</span>
                  <span className="value">{cognitoConfig.identityPoolId}</span>
                </div>
              </div>
              <div className="config-section">
                <h4>Resources</h4>
                <div className="config-item">
                  <span className="label">Homework Bucket</span>
                  <span className="value">{cognitoConfig.homeworkBucket}</span>
                </div>
                <div className="config-item">
                  <span className="label">Grades Table</span>
                  <span className="value">{cognitoConfig.gradesTable}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="timeline">
          <div className="timeline-section">
            <div className="section-header">
              <h3 className="section-title">🔐 Option 1 — Hosted UI</h3>
              <span className="posts-count">AWS Managed</span>
            </div>
            <div className="section-body">
              <p className="auth-description">
                Use AWS Cognito's pre-built experience for instant demos and
                production-ready login without designing forms.
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
                <ul>
                  <li>AWS-managed UI with built-in security</li>
                  <li>Supports MFA, social, SAML, enterprise federation</li>
                  <li>
                    Redirects back to <code>/callback</code> with tokens
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <div className="section-header">
              <h3 className="section-title">🎨 Option 2 — Custom Auth</h3>
              <span className="posts-count">Fully Custom</span>
            </div>
            <div className="section-body">
              <p className="auth-description">
                Build bespoke flows with <code>amazon-cognito-identity-js</code>
                : same security, but total UI freedom.
              </p>
              <div className="button-group">
                <button
                  className="button primary"
                  onClick={() => navigate("/login")}
                >
                  Custom Login
                </button>
                <button
                  className="button secondary"
                  onClick={() => navigate("/signup")}
                >
                  Custom Sign Up
                </button>
              </div>
              <div className="info-box">
                <ul>
                  <li>Own the UX, copy, and flows</li>
                  <li>Email verification + forgot password flows</li>
                  <li>Direct access to tokens for API/S3/DynamoDB</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
