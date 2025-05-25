"use client"
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserContext } from '../context/UserContext';
import axiosInstance from "../axiosInstance";

export const ProfileActions: React.FC = () => {
    const { setIsLoggedIn } = useContext(UserContext);
    const router = useRouter();

    const handleLogout = async() => {
        try {
            await axiosInstance.post(process.env.NEXT_PUBLIC_API_URL + "/logout", {}, {
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

    const deleteAccount = async() => {
        try {
            let url = process.env.NEXT_PUBLIC_API_URL + "/user/delete";
            await axiosInstance.delete(url);
            setIsLoggedIn(false);
            router.replace("/");
            toast.info("Account deleted!");
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