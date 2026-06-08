import { createContext, useCallback, useEffect, useState } from "react";
import { getToken, removeToken, isTokenExpired } from "../utils/tokenStorage";
import axiosClient from "../api/interceptor";
import type { UserResponse } from "../types/common.types";
import { toastInfo, toastSuccess } from "../components/toast/toast";

interface AuthContextType {
  user: any;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSessionExpiry = useCallback(() => {
    removeToken();
    setUser(null);
    setLoading(false);

    if (window.location.pathname !== "/") {
      toastInfo("Session expired. Returning to homepage.");
      window.location.replace("/");
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      handleSessionExpiry();
      return;
    }

    try {
      const response = await axiosClient.get("/user/me");
      setUser(response.data);
    } catch (error) {
      handleSessionExpiry();
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpiry]);


  useEffect(() => {
    fetchUserInfo();
    const sessionInterval = setInterval(() => {
      const token = getToken();

      if (window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        if (!token || isTokenExpired(token)) {
          handleSessionExpiry();
        }
      }
    }, 5000);

    return () => clearInterval(sessionInterval);
  }, [fetchUserInfo, handleSessionExpiry]);

  const logout = () => {
    toastSuccess("Logged out successfully.");
    setUser(null);
    removeToken();
    setTimeout(() => {
      window.location.replace("/");
    }, 10);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      loading,
      isAuthenticated: !!user,
      logout,
      refreshUser: fetchUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};  