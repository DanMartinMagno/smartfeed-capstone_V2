// frontend/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login,
  signup,
  updateUserData,
  changePassword as changePasswordAPI,
  User,
} from "../api/authApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    lastName: string,
    firstName: string,
    middleInitial: string,
    email: string,
    password: string
  ) => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (token && storedUser) {
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(decodeBase64Url(base64Payload));
        const tokenExpiry = decodedPayload.exp * 1000;

        if (Date.now() < tokenExpiry) {
          setUser(JSON.parse(storedUser));
        } else {
          await handleLogout();
          console.warn("Session expired, please log in again.");
        }
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setLoading(false);
    }
  };

  const decodeBase64Url = (base64UrlString: string) => {
    let base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    return atob(base64);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const userData = await login(email, password);
      if (userData && userData.token) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("token", userData.token);
        setUser(userData);
      } else {
        throw new Error("Token not received or invalid");
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Throw custom error message from backend
        throw new Error(error.response.data.message);
      } else {
        // Generic error message for unexpected issues
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup,
        updateUser: async (userData: User) => {
          const updatedUser = await updateUserData(userData);
          setUser(updatedUser);
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        },
        changePassword: async (
          currentPassword: string,
          newPassword: string
        ) => {
          await changePasswordAPI(currentPassword, newPassword);
          await handleLogout();
          alert("Password changed successfully. Please log in again.");
        },
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
