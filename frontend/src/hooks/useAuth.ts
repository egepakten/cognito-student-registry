// frontend/src/hooks/useAuth.ts
/**
 * Thin wrapper around the AuthContext.
 *
 * Usage:
 * const { user, isAuthenticated, loading, logout } = useAuth();
 */

import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  return useAuthContext();
}
