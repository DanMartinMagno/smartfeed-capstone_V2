//AuthContex.tsx

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
  loading: boolean; // Add loading state
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track loading status

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false); // Mark as loaded
      }
    };
    loadUserData();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const userData = await login(email, password);
    if (userData && userData.token) {
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", userData.token);
    } else {
      throw new Error("Token not received or invalid");
    }
  };

  const handleUpdateUser = async (userData: User) => {
    const updatedUser = await updateUserData(userData);
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await changePasswordAPI(currentPassword, newPassword);
      await handleLogout();
      alert("Password changed successfully. Please log in again.");
    } catch (error: any) {
      // Check if the backend response indicates an incorrect current password
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Current password is incorrect"
      ) {
        alert(
          "The current password you entered is incorrect. Please try again."
        );
      } else {
        // Log unexpected errors only

        alert(
          "An error occurred while trying to change your password. Please try again later."
        );
      }
    }
  };

  const handleLogout = async () => {
    setUser(null);
    await AsyncStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // Provide loading status
        login: handleLogin,
        signup,
        updateUser: handleUpdateUser,
        changePassword: handleChangePassword,
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
