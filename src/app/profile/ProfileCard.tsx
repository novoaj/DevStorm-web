import React from 'react';

interface User {
    avatar: string;
    username: string;
    email: string;
    dateJoined: string;
}

interface ProfileCardProps {
    user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    return (
        <div className="container h-96 mt-12 w-72 mr-5 bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
            <div className="text-center mx-auto mb-5">
                <div className="flex justify-center">
                    <img src={user.avatar} alt="Avatar" className="w-24 rounded-full" />
                </div>
                <h2 className="text-xl font-semibold mt-5 mb-3">{user.username}</h2>
            </div>

            <div className='mb-5'> 
                <p className="pl-3">Email: </p>
                <div className="bg-primary-400 border border-primary-200 rounded pl-3 pr-3 pt-1 pb-1">
                    <p>{user.email}</p>
                </div>
            </div>
            
            <p className="pl-3 mb-5">Date Joined: {user.dateJoined}</p>
            <div className="flex justify-between items-center">
                <button className="w-1/2 py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-lg transition duration-300">Edit Profile</button>
                <button className="w-1/2 py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-lg transition duration-300">Logout</button>
            </div>
        </div>
    );
};

export default ProfileCard;