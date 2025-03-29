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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false) 
    const [isInitialized, setIsInitialized] = useState<boolean>(false); // Tracks if localStorage has been read
    
    // Retrieve the stored value during initialization
    useEffect(() => {
        // Only run this effect on initial mount to read from localStorage
        const storedValue = localStorage.getItem("isLoggedIn");
        if (storedValue !== null) {
            try {
                const parsedValue = JSON.parse(storedValue);
                setIsLoggedIn(parsedValue);
            } catch (error) {
                // If parsing fails, default to false
                setIsLoggedIn(false);
            }
        }
        setIsInitialized(true)
    }, [])

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        }
    }, [isLoggedIn, isInitialized]);

    const value: UserContextType = { isLoggedIn, setIsLoggedIn }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};