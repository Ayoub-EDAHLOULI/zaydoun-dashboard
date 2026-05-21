// contexts/AuthContext.tsx
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

  const initialized = useRef(false);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors — always clear state
    } finally {
      setAccessTokenStore(null);
      setAccessToken(null);
      setUser(null);

      router.push("/login");
    }
  }, [router]);

  const attemptSilentRefresh = useCallback(async () => {
    try {
      const data = await authService.refreshToken();
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
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      attemptSilentRefresh();
    }

    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<{ accessToken: string }>;
      if (customEvent.detail?.accessToken) {
        setAccessTokenStore(customEvent.detail.accessToken);
        setAccessToken(customEvent.detail.accessToken);
      }
    };

    const handleLogout = () => {
      void logout();
    };

    window.addEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefresh);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefresh);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [attemptSilentRefresh, logout]);

  const login = async (credentials: LoginDto): Promise<User> => {
    const response = await authService.login(credentials);
    setAccessTokenStore(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

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
