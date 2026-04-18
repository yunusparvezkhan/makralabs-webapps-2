"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearDashboardStoredAccessToken,
  getDashboardStoredAccessToken,
  setDashboardStoredAccessToken
} from "@/lib/dashboard-auth-storage";
import {
  dashboardGetCurrentUser,
  dashboardLogin,
  dashboardRegister
} from "@/lib/dashboard-api-client";
import type { DashboardUser } from "@/types/dashboard-api";

type DashboardAuthContextValue = {
  token: string | null;
  user: DashboardUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setAccessToken: (token: string) => Promise<void>;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | null>(null);

export function DashboardAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearDashboardStoredAccessToken();
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = getDashboardStoredAccessToken();

    if (!activeToken) {
      logout();
      return;
    }

    try {
      const currentUser = await dashboardGetCurrentUser(activeToken);
      setToken(activeToken);
      setUser(currentUser);
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const existingToken = getDashboardStoredAccessToken();

      if (!existingToken) {
        if (isMounted) {
          setIsReady(true);
        }
        return;
      }

      try {
        const currentUser = await dashboardGetCurrentUser(existingToken);

        if (!isMounted) {
          return;
        }

        setToken(existingToken);
        setUser(currentUser);
      } catch {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const setAccessToken = useCallback(
    async (nextToken: string) => {
      setDashboardStoredAccessToken(nextToken);
      setToken(nextToken);

      try {
        const currentUser = await dashboardGetCurrentUser(nextToken);
        setUser(currentUser);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [logout]
  );

  const login = useCallback(async (email: string, password: string) => {
    const response = await dashboardLogin(email, password);
    setDashboardStoredAccessToken(response.accessToken);
    setToken(response.accessToken);

    if (response.user) {
      setUser(response.user);
      return;
    }

    const currentUser = await dashboardGetCurrentUser(response.accessToken);
    setUser(currentUser);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const response = await dashboardRegister(email, password);
    setDashboardStoredAccessToken(response.accessToken);
    setToken(response.accessToken);

    if (response.user) {
      setUser(response.user);
      return;
    }

    const currentUser = await dashboardGetCurrentUser(response.accessToken);
    setUser(currentUser);
  }, []);

  const value = useMemo<DashboardAuthContextValue>(
    () => ({
      token,
      user,
      isReady,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
      setAccessToken
    }),
    [token, user, isReady, login, register, logout, refreshUser, setAccessToken]
  );

  return <DashboardAuthContext.Provider value={value}>{children}</DashboardAuthContext.Provider>;
}

export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);

  if (!context) {
    throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  }

  return context;
}
