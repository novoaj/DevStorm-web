"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

interface User {
  username: string;
  email: string;
  dateJoined: string;
  projects: number;
  projectsCompleted: number;
}

interface UserDataContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Only auto-fetch if we haven't tried yet and don't have user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user && !loading && !hasAttemptedFetch) {
        setLoading(true);
        setHasAttemptedFetch(true);
        try {
          const response = await axiosInstance.get('/user/info');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, loading, hasAttemptedFetch]);

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};