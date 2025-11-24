// frontend/src/context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  CognitoUserInfo,
  AuthContextValue,
  AuthTokens,
} from "../types/cognitoService.types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CognitoUserInfo | null>(null);
  // CHANGE: Added tokens state to store raw token strings
  // REASON: AWS SDK needs raw idToken for credential exchange
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      // CHANGE: Retrieve stored tokens from localStorage
      const storedTokens = localStorage.getItem("wiseuni_tokens");
      const storedUser = localStorage.getItem("wiseuni_user");

      if (storedTokens && storedUser) {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const parsedUser: CognitoUserInfo = JSON.parse(storedUser);

        // Check if token is expired
        if (parsedUser.exp && parsedUser.exp * 1000 > Date.now()) {
          setTokens(parsedTokens); // ← Store raw tokens
          setUser(parsedUser);
        } else {
          // Token expired, clear storage
          clearSession();
        }
      }
    } catch (error) {
      console.error("Session check failed:", error);
      clearSession();
    } finally {
      setLoading(false);
    }
  }

  // CHANGE: Updated to store both tokens and decoded user
  function handleAuthSuccess(authTokens: AuthTokens) {
    // Decode the ID token to get user info
    const decodedUser = decodeJWT(authTokens.idToken);

    // Store both in state
    setTokens(authTokens); // ← Raw tokens for AWS SDK
    setUser(decodedUser); // ← Decoded info for UI

    // Persist to localStorage
    localStorage.setItem("wiseuni_tokens", JSON.stringify(authTokens));
    localStorage.setItem("wiseuni_user", JSON.stringify(decodedUser));
  }

  function clearSession() {
    setUser(null);
    setTokens(null); // ← Clear tokens too
    localStorage.removeItem("wiseuni_tokens");
    localStorage.removeItem("wiseuni_user");
  }

  function logout() {
    clearSession();
  }

  // Helper to decode JWT
  function decodeJWT(token: string): CognitoUserInfo {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  // CHANGE: Added tokens to context value
  // REASON: Components can now access raw idToken for AWS SDK calls
  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    logout,
    tokens, // ← NOW AVAILABLE!
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext };
export type { AuthContextValue };
