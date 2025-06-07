import { UserDataProvider } from '../context/UserDataContext';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <UserDataProvider>
      {children}
    </UserDataProvider>
  );
}