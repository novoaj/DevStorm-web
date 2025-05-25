"use client"
import React, {useContext, useState} from 'react';
import Image from "next/image";
import AvatarIcon from "../../../public/images/avatar-default.svg";
import axiosInstance from "../axiosInstance";
import {useRouter} from 'next/navigation';
import { toast } from 'sonner';
import { UserContext } from '../context/UserContext';
import { User } from './edit/ProfileInterfaces';
import { ProfileActions } from './ProfileActions';

interface ProfileCardProps {
    initialUser?: User | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ initialUser }) => {
    // Use initial data from server, fallback to empty state
    const [user, setUser] = useState<User | null>(initialUser || null);
    const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: '',
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const router = useRouter();

    const handleUpdateUsername = async() => {
        if (user && user.username !== formData.username){
            if (formData.username.length < 5) {
                toast.error("New username must be 5+ characters")
                return;
            }
            try{
                let url = process.env.NEXT_PUBLIC_API_URL + `/user/update-username`;
                let response = await axiosInstance.put(url, {
                    new_username: formData.username,
                    current_password: formData.oldPassword
                })
                if (response.status === 200) {
                    toast.success("Reset Username");
                    // Update local state
                    setUser(prev => prev ? {...prev, username: formData.username} : null);
                }
            }catch (err) {
                console.error(err);
                toast.error("Error resetting Username. This username might be taken. Make sure password is filled in correctly")
            }
        }
    }

    const handleLogout = async() => {
        try{
            await axiosInstance.post(process.env.NEXT_PUBLIC_API_URL + "/logout", {}, 
            {
                withCredentials: true,
            })
        
            setIsLoggedIn(false);
            toast.success('Logged out');
            router.replace("/auth/login");
        }catch (err) {
            toast.success('Logged out');
            setIsLoggedIn(false);
            router.replace("/auth/login");
        }
    }

    const editProfilePage = () => {
        router.push("/profile/edit")
    }

    const deleteAccount = async() => {
        try{
            let url = process.env.NEXT_PUBLIC_API_URL + "/user/delete";
            await axiosInstance.delete(url);
            setIsLoggedIn(false);
            router.replace("/");
            toast.info("Account deleted!");
        }catch (error){
            console.error(error);
            toast.error("There was a problem deleting your account!");
        }
    }

    if (!user) {
        return (
            <div className="container h-96 mt-5 w-full bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
                <div className="flex justify-center items-center">
                    <p className="text-gray">Failed to load profile data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container h-96 mt-5 w-full bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
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
            
            {/* Client component for interactive buttons */}
            <ProfileActions />
        </div>
    );
};

export default ProfileCard;