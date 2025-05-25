import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ProfileCard from './ProfileCard';
import ProjectDashboard from './ProjectDashboard';
import { serverFetchWithRefresh } from '../actions/actions';

// Helper functions for server-side data fetching
async function getUserData() {
  try {
    const response = await serverFetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, 'GET');

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
      return date.toLocaleDateString(undefined, options);
    };

    return {
      username: response.data.username,
      email: response.data.email,
      dateJoined: formatDate(response.data.date_joined),
      projects: response.data.projects,
      projectsCompleted: response.data.projects_completed,
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}

async function getUserProjects() {
  try {
    const response = await serverFetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/project/by-user`, 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

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