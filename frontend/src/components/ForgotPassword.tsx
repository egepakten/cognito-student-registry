// frontend/src/components/ForgotPassword.tsx
/**
 * Forgot Password Flow (2-step)
 *
 * Step 1: User enters email → we call Cognito `forgotPassword`
 *         Cognito emails a 6-digit code.
 * Step 2: User enters code + new password → we call `confirmPassword`
 *         Password is reset and user can log in again.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { forgotPassword, confirmPassword } from "../services/cognitoService";
import { isCognitoError } from "../utils/errorHandler";

type ForgotStep = "request" | "confirm";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPassword(email);
      setSuccess(`Password reset code sent to ${email}`);
      setStep("confirm");
    } catch (err: unknown) {
      if (isCognitoError(err)) {
        if (err.code === "UserNotFoundException") {
          setError("No account found with that email.");
        } else {
          setError(err.message || "Failed to start password reset.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await confirmPassword(email, code, newPassword);
      setSuccess("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err: unknown) {
      if (isCognitoError(err)) {
        if (err.code === "CodeMismatchException") {
          setError("Invalid code. Please double‑check and try again.");
        } else if (err.code === "ExpiredCodeException") {
          setError("Code expired. Please request a new reset code.");
        } else {
          setError(err.message || "Failed to reset password.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">
            {step === "request" ? "🔑 Forgot Password" : "✅ Reset Password"}
          </h2>
          <p className="auth-subtitle">
            {step === "request"
              ? "Enter your email and we'll send you a reset code."
              : `Enter the code sent to ${email} and choose a new password.`}
          </p>
        </div>

        {error && (
          <div className="message-box message-error">
            <span className="message-icon">❌</span>
            <p className="message-text">{error}</p>
          </div>
        )}

        {success && (
          <div className="message-box message-success">
            <span className="message-icon">✅</span>
            <p className="message-text">{success}</p>
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleRequest} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button auth-button-primary"
            >
              {loading ? (
                <span className="auth-loading">
                  <span className="auth-spinner" />
                  Sending code...
                </span>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {step === "confirm" && (
          <form onSubmit={handleConfirm} className="auth-form">
            <div className="form-group">
              <label htmlFor="code" className="form-label">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                className="form-input"
                placeholder="Enter the 6‑digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <p className="form-hint">
                Must meet your Cognito password policy (length, complexity).
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button auth-button-primary"
            >
              {loading ? (
                <span className="auth-loading">
                  <span className="auth-spinner" />
                  Resetting...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p className="auth-footer-text">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="auth-link"
            >
              Back to Login
            </button>
          </p>

          <button
            onClick={() => navigate("/")}
            className="auth-back-link"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}


