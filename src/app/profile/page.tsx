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
            <ProfileCard user={user}/>
            <ProjectDashboard projects={user}/>
        </div>
    );
};

export default ProfilePage;