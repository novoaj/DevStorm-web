"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import axiosInstance from "../axiosInstance";
import { deleteAccount } from '../actions/profile-actions';

export const ProfileActions: React.FC = () => {
    const { setIsLoggedIn } = useUser();
    const router = useRouter();

    const handleLogout = async() => {
        try {
            await axiosInstance.post("/logout", {}, {
                withCredentials: true,
            });
        
            setIsLoggedIn(false);
            toast.success('Logged out');
            router.replace("/auth/login");
        } catch (err) {
            toast.success('Logged out');
            setIsLoggedIn(false);
            router.replace("/auth/login");
        }
    }

    const editProfilePage = () => {
        router.push("/profile/edit");
    }

    // server action for account deletion
    const handleDeleteAccount = async() => {
        try {
            const result = await deleteAccount();
            
            if (result.success) {
                setIsLoggedIn(false);
                router.replace("/");
                toast.info("Account deleted!");
            } else {
                toast.error(result.message || "There was a problem deleting your account!");
            }
        } catch (error) {
            console.error(error);
            toast.error("There was a problem deleting your account!");
        }
    }

    return (
        <div className="flex justify-between items-center">
            <button 
                className="w-1/2 py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-full transition duration-300" 
                onClick={editProfilePage}
            >
                Edit Profile
            </button>
            <button 
                className="w-1/2 py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};
