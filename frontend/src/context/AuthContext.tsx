// frontend/src/context/AuthContext.tsx
// ✅ COMPLETE WORKING VERSION

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

// ========================================
// CREATE CONTEXT
// ========================================
const AuthContext = createContext<AuthContextValue | null>(null);

// ========================================
// HOOK TO USE CONTEXT
// ========================================
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

// ========================================
// PROVIDER COMPONENT
// ========================================
export function AuthProvider({ children }: { children: ReactNode }) {
  // State for decoded user info (for UI display)
  const [user, setUser] = useState<CognitoUserInfo | null>(null);

  // State for raw tokens (for AWS SDK calls)
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // ========================================
  // CHECK EXISTING SESSION ON PAGE LOAD
  // ========================================
  useEffect(() => {
    checkExistingSession();
  }, []);

  function checkExistingSession() {
    try {
      const savedTokens = localStorage.getItem("wiseuni_tokens");
      const savedUser = localStorage.getItem("wiseuni_user");

      if (savedTokens && savedUser) {
        const parsedTokens: AuthTokens = JSON.parse(savedTokens);
        const parsedUser: CognitoUserInfo = JSON.parse(savedUser);

        // Check if token is expired
        const isExpired = parsedUser.exp && parsedUser.exp * 1000 < Date.now();

        if (!isExpired) {
          console.log("✅ Session restored from localStorage");
          setTokens(parsedTokens);
          setUser(parsedUser);
        } else {
          console.log("⏰ Token expired, clearing session");
          clearSession();
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      clearSession();
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // HANDLE AUTH SUCCESS (Called from Login.tsx)
  // ========================================
  function handleAuthSuccess(authTokens: AuthTokens) {
    console.log("🔐 handleAuthSuccess called");

    // Step 1: Decode the ID token to get user info
    const decodedUser = decodeJWT(authTokens.idToken);
    console.log("👤 Decoded user:", decodedUser);

    // Step 2: Store in React state
    setTokens(authTokens);
    setUser(decodedUser);

    // Step 3: Persist to localStorage
    localStorage.setItem("wiseuni_tokens", JSON.stringify(authTokens));
    localStorage.setItem("wiseuni_user", JSON.stringify(decodedUser));

    console.log("✅ Auth state updated successfully");
  }

  // ========================================
  // DECODE JWT TOKEN
  // ========================================
  function decodeJWT(token: string): CognitoUserInfo {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      throw new Error("Invalid token");
    }
  }

  // ========================================
  // CLEAR SESSION
  // ========================================
  function clearSession() {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("wiseuni_tokens");
    localStorage.removeItem("wiseuni_user");
  }

  // ========================================
  // LOGOUT
  // ========================================
  function logout() {
    console.log("👋 Logging out...");
    clearSession();
  }

  // ========================================
  // CONTEXT VALUE
  // ========================================
  const value: AuthContextValue = {
    user,
    tokens, // ← For AWS SDK calls (tokens.idToken)
    isAuthenticated: !!user,
    loading,
    logout,
    handleAuthSuccess, // ← Called from Login.tsx
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export for type usage
export { AuthContext };
