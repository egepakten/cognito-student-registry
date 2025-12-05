/**
 * OAuth Callback Handler
 *
 * This component handles the OAuth 2.0 authorization code flow redirect from Cognito.
 * It exchanges the authorization code for JWT tokens and stores them.
 *
 * Flow:
 * 1. Cognito redirects here with: ?code=xxx
 * 2. Exchange code for tokens (POST to /oauth2/token)
 * 3. Save tokens to localStorage
 * 4. Redirect to dashboard
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCodeForTokens } from "./exchangeCodeForTokens";
import { parseJwt } from "./parseJwt";
import styles from "../../styles/Callback.module.css";

type CallbackStatus = "loading" | "success" | "error";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [error, setError] = useState<string>("");

  const hasRun = useRef(false); // To prevent double execution in Strict Mode

  useEffect(() => {
    //  Only run once, even in StrictMode
    if (hasRun.current) return;
    hasRun.current = true;

    handleCallback();
  });

  const handleCallback = async () => {
    try {
      // Get authorization code from URL query params
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      console.log("Callback params:", { code, error, errorDescription });

      // Handle OAuth errors from Cognito
      if (error) {
        console.error("OAuth error:", error, errorDescription);
        setError(errorDescription || error);
        setStatus("error");
        return;
      }

      // Validate authorization code exists
      if (!code) {
        setError("No authorization code received from Cognito");
        setStatus("error");
        return;
      }

      console.log("Exchanging authorization code for tokens...");

      // Exchange authorization code for JWT tokens
      const tokens = await exchangeCodeForTokens(code);

      console.log("Token exchange successful:", {
        hasAccessToken: !!tokens.access_token,
        hasIdToken: !!tokens.id_token,
        hasRefreshToken: !!tokens.refresh_token,
      });

      // Store tokens in localStorage for authenticated requests
      localStorage.setItem("accessToken", tokens.access_token);
      localStorage.setItem("idToken", tokens.id_token);
      localStorage.setItem("refreshToken", tokens.refresh_token);

      // Decode ID token to extract user information
      const userInfo = parseJwt(tokens.id_token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      console.log("User authenticated:", {
        email: userInfo.email,
        sub: userInfo.sub,
      });

      setStatus("success");
      console.log("✅ Success status set, will navigate in 1.5 seconds...");
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        console.log("⏰ Redirecting to dashboard...");
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      console.error("Callback processing error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === "loading" && (
          <>
            <div className={styles.spinner} />
            <h2 className={styles.title}>Processing Login...</h2>
            <p className={styles.subtitle}>
              Exchanging authorization code for tokens
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.icon}>✅</div>
            <h2 className={styles.title}>Login Successful!!!!!</h2>
            <p className={styles.subtitle}>Redirecting to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className={styles.icon}>❌</div>
            <h2 className={styles.title}>Authentication Failed</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={() => navigate("/")} className={styles.button}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
