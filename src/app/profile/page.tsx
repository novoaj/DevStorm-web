import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ProfilePageClient from './ProfilePageClient';
import { getUserData, getUserProjects } from '../actions/data-fetchers';

// Server Component - fetches data
const ProfilePage: React.FC = async () => {
    const cookieStore = await cookies();
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

    return <ProfilePageClient initialUser={user} initialProjects={projects} />;
};

export default ProfilePage;
