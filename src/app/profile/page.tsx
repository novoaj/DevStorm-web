import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ProfileCard from './ProfileCard';
import ProjectDashboard from './ProjectDashboard';
import { getUserData, getUserProjects } from '../actions/data-fetchers';

// Server Component
const ProfilePage: React.FC = async () => {
    // Check auth with cookies directly
    const cookieStore = cookies();
    const hasAuthCookies = cookieStore.has('csrf_access_token') || cookieStore.has('csrf_refresh_token');
    
    if (!hasAuthCookies) {
        redirect('/auth/login');
    }

    // Fetch data in parallel on the server
    const [userData, projectsData] = await Promise.allSettled([
        getUserData(),
        getUserProjects() 
    ]);

    const user = userData.status === 'fulfilled' ? userData.value : null;
    const projects = projectsData.status === 'fulfilled' ? projectsData.value : [];

    return (
        <div className="flex p-5 min-h-screen">
            <div className="animate-slideUp flex justify-center flex-col md:flex-row w-full">
                <div className='mx-2 md:w-2/5 lg:w-2/5 xl:w-2/6 2xl:w-2/6'>
                    <ProfileCard initialUser={user} />
                </div>
                <div className='mx-2 md:w-3/5 lg:w-3/5 xl:w-4/6 2xl:w-4/6'>
                    <ProjectDashboard initialProjects={projects} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
