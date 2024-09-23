"use client";
import { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';

// ts interfaces
interface UserContextType {
    isLoggedIn: boolean; // Boolean state for login status
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>; // Function to mutate userstate
}
interface UserProviderProps {
    children: any; // ReactNode is the type for children in React
}

// Create the context
export const UserContext = createContext<UserContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
});

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // null means not logged in

    const value: UserContextType = { isLoggedIn, setIsLoggedIn }
    return (
        <UserContext.Provider value ={value}>
            {children}
        </UserContext.Provider>
    );
};