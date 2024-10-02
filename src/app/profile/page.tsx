import React from 'react';
import ProfileCard from './ProfileCard';
import ProjectDashboard from './ProjectDashboard';

const ProfilePage: React.FC = () => {
    return (
        <div className="flex p-5 min-h-screen">
            <div className="animate-slideUp flex justify-center flex-col md:flex-row w-full">
                <div className='mx-2 md:w-2/5 lg:w-2/5 xl:w-2/6 2xl:w-2/6'>
                    <ProfileCard/>
                </div>
                <div className='mx-2 md:w-3/5 lg:w-3/5 xl:w-4/6 2xl:w-4/6'>
                    <ProjectDashboard/>
                </div>
            </div>
            
        </div>
    );
};

export default ProfilePage;