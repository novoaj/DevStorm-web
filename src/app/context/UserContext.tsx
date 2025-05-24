"use client";
import { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';

// ts interfaces
interface UserContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
}
interface UserProviderProps {
    children: React.ReactNode;
    initialLoggedIn?: boolean;
}

// Create the context
export const UserContext = createContext<UserContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    isLoading: true
});

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ 
    children,
    initialLoggedIn = false
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialLoggedIn);
    const [isLoading, setIsLoading] = useState<boolean>(!initialLoggedIn); // Only loading if no initial state
    
    useEffect(() => {
        // If we have initial state from server, trust it and don't verify again immediately
        if (initialLoggedIn) {
            setIsLoading(false);
            return;
        }
        
        // Only verify if we don't have initial state
        const verifyAuthStatus = async () => {
            try {
                const response = await fetch('/api/auth/status', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const { isLoggedIn: authStatus } = await response.json();
                    setIsLoggedIn(authStatus);
                } else {
                    console.warn(`Auth status API returned: ${response.status}`)
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error verifying authentication:", error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };
        
        verifyAuthStatus();
    }, [initialLoggedIn]);
    
    const value: UserContextType = { 
        isLoggedIn, 
        setIsLoggedIn,
        isLoading
    };
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};