import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/apiService";
import { authEventEmitter } from "../events/AuthEventEmitter";

interface AuthContextData {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
    };

    loadToken();

    // Escuta o evento de logout por token expirado
    const handleLogout = () => {
      logout();
    };

    authEventEmitter.on("logout", handleLogout);

    return () => {
      authEventEmitter.off("logout", handleLogout);
    };
  }, [logout]);

  const login = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);