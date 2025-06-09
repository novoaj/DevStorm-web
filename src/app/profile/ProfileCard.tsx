"use client"
import React from 'react';
import Image from "next/image";
import AvatarIcon from "../../../public/images/avatar-default.svg"; // TODO webp maybe
import { useUser } from '../context/UserContext'; // Auth context
import { useUserData } from '../context/UserDataContext'; // Profile data context
import { ProfileActions } from './ProfileActions';

const ProfileCard: React.FC = () => {
    const { isLoggedIn } = useUser(); // Auth state
    const { user, loading } = useUserData(); // Profile data

    if (loading) {
        return (
            <div className="container h-96 mt-5 w-full bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
                <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container h-96 mt-5 w-full bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray">Failed to load profile data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-96 mt-5 w-full bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
            <div className="text-center mx-auto mb-5">
                <div className="flex justify-center">
                    <Image 
                        priority 
                        src={AvatarIcon} 
                        alt="Avatar" 
                        className="bg-primary-200 w-24 rounded-full border border-primary-200" 
                    />
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
            
            <ProfileActions />
        </div>
    );
};

export default React.memo(ProfileCard);
