// The NEW, correct way
"use client";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  // isLoading is no longer needed because the initial state is instant.
}

// The context definition stays the same
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserProviderProps {
  children: React.ReactNode;
  // This prop comes from the server!
  initialLoggedIn: boolean;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialLoggedIn,
}) => {
  // The state is initialized INSTANTLY with the value from the server.
  // No flicker, no loading state.
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  // The value of this provider is to share this state and the function
  // to update it across all client components.
  const value: UserContextType = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};