"use client";
import React, { useEffect } from 'react';
import ProfileCard from './ProfileCard';
import ProjectDashboard from './ProjectDashboard';
import { useUserData } from '../context/UserDataContext';

interface ProfilePageClientProps {
  initialUser: any;
  initialProjects: any[];
}

const ProfilePageClient: React.FC<ProfilePageClientProps> = ({ 
  initialUser, 
  initialProjects 
}) => {
  const { setUser } = useUserData();

  // Set the user in context when component mounts
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  return (
    <div className="flex p-5 min-h-screen">
      <div className="animate-slideUp flex justify-center flex-col md:flex-row w-full">
        <div className='mx-2 md:w-2/5 lg:w-2/5 xl:w-2/6 2xl:w-2/6'>
          <ProfileCard initialUser={initialUser} />
        </div>
        <div className='mx-2 md:w-3/5 lg:w-3/5 xl:w-4/6 2xl:w-4/6'>
          <ProjectDashboard initialProjects={initialProjects} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePageClient;