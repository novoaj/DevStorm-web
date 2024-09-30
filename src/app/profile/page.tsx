import React from 'react';
import ProfileCard from './ProfileCard';
import ProjectDashboard from './ProjectDashboard';

interface User {
    avatar: string;
    username: string;
    email: string;
    dateJoined: string;
}

const ProfilePage: React.FC = () => {
    const user = {
        avatar: 'https://via.placeholder.com/150',
        username: 'johndoe',
        email: 'johndoe@example.com',
        dateJoined: 'January 1, 2020',
        projects: [
            { id: '1', name: 'Project One' },
            { id: '2', name: 'Project Two' },
            { id: '3', name: 'Project Three' },
        ],
    };

    return (
        <div className="flex p-5 min-h-screen">
            <div className="animate-slideUp flex justify-center flex-col md:flex-row w-full">
                <div className='mx-2 md:w-2/5 lg:w-2/5 xl:w-2/6 2xl:w-2/6'>
                    <ProfileCard user={user}/>
                </div>
                <div className='mx-2 md:w-3/5 lg:w-3/5 xl:w-4/6 2xl:w-4/6'>
                    <ProjectDashboard projects={user}/>
                </div>
            </div>
            
        </div>
    );
};

export default ProfilePage;