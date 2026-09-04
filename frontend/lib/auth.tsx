"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getMe,
  getAccessToken,
  clearAccessToken,
  type ApiUser,
} from "./api";

type AuthContextType = {
  user: ApiUser | null;
  loading: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (token: string, role: string) => {
    setLoading(true);
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      clearAccessToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
}

export function useRole(allowedRoles: string[]) {
  const { user, loading } = useAuth();

  if (loading) {
    return {
      hasAccess: false,
      loading: true,
    };
  }

  if (!user) {
    return {
      hasAccess: false,
      loading: false,
    };
  }

  return {
    hasAccess: allowedRoles.includes(user.role),
    loading: false,
  };
}
