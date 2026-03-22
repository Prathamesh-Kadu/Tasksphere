import { createContext, useCallback, useEffect, useState } from "react";
import { getToken, removeToken, isTokenExpired } from "../utils/tokenStorage";
import axiosClient from "../api/interceptor";

interface AuthContextType {
  user: any;
  role: string | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserInfo = useCallback(async () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      removeToken();
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.get("/user/me");
      setUser(response.data);
    } catch (error) {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      loading,
      logout,
      refreshUser: fetchUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};