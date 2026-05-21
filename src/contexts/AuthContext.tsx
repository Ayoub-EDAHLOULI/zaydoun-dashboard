"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/services/auth.service";
import { User, LoginDto } from "@/types/auth.types";
import {
  TOKEN_REFRESHED_EVENT,
  setAccessTokenStore,
} from "@/lib/api/fetchWithAuth";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — always clear state
    } finally {
      setAccessTokenStore(null);
      setAccessToken(null);
      setUser(null);
      routerRef.current.push("/login");
    }
  }, []);

  // Run once on mount
  useEffect(() => {
    const run = async () => {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5000),
      );
      try {
        const data = await Promise.race([authService.refreshToken(), timeout]);
        setAccessTokenStore(data.accessToken);
        setAccessToken(data.accessToken);
        const profile = await authService.getProfile(data.accessToken);
        setUser(profile);
      } catch {
        setAccessTokenStore(null);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  // Event listeners — stable, no deps that change
  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const e = event as CustomEvent<{ accessToken: string }>;
      if (e.detail?.accessToken) {
        setAccessTokenStore(e.detail.accessToken);
        setAccessToken(e.detail.accessToken);
      }
    };

    const handleLogout = () => { void logout(); };

    window.addEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefresh);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefresh);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [logout]);

  const login = async (credentials: LoginDto): Promise<User> => {
    const response = await authService.login(credentials);
    setAccessTokenStore(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  };

  const updateUser = (newUser: User) => setUser(newUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
