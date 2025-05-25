"use client";

import { UserProvider } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';

interface ClientProvidersProps {
  children: React.ReactNode;
  initialLoggedIn: boolean;
}

export function ClientProviders({ children, initialLoggedIn }: ClientProvidersProps) {
  return (
    <UserProvider initialLoggedIn={initialLoggedIn}>
      <TaskProvider>
        {children}
      </TaskProvider>
    </UserProvider>
  );
}