"use client";

import { UserProvider } from './context/UserContext';

interface ClientProvidersProps {
  children: React.ReactNode;
  initialLoggedIn: boolean;
}

export function ClientProviders({ children, initialLoggedIn }: ClientProvidersProps) {
  return (
    <UserProvider initialLoggedIn={initialLoggedIn}>
        {children}
    </UserProvider>
  );
}