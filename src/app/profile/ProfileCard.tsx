"use client"
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import AvatarIcon from "../../../public/images/avatar-default.svg";
import ButtonWhite from '../components/ButtonWhite';
import Cross from '../components/Cross';
import axios from "axios";
import axiosInstance from "../axiosInstance";
import {useRouter} from 'next/navigation';
import Spinner from '../components/Spinner';

interface User {
    username: string;
    email: string;
    dateJoined: string;
    projects: number;
    projectsCompleted: number;
}

interface ProfileCardProps {
    
}

const handleUpdateProfile = () => {
    console.log("updating profile...");
    // TODO useState for password/username changes to form. hit update api endpoint
}

const ProfileCard: React.FC<ProfileCardProps> = ({ }) => {
    const [user, setUser] = useState<User>()
    const router = useRouter();

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/user/info";
        const getData = async() => {
            const response = await axiosInstance.get(url);
            console.log(response.data);
            if (response){
                setUser({
                    username: response.data.username,
                    email: response.data.email,
                    dateJoined: formatDate(response.data.date_joined),
                    projects: response.data.projects,
                    projectsCompleted: response.data.projects_completed,
                });
            }
        }   
        getData(); 
    }, [])

    return (
        <div className="container h-96 mt-5 w-full bg-primary-300 border border-primary-200 text-slate-100 shadow-md rounded-md p-5">
            {user === undefined ? 
            (
                <div className="flex justify-center items-center">
                    <Spinner/>
                </div>
            ): (
                <>
                    <div className="text-center mx-auto mb-5">
                        <div className="flex justify-center">
                            <Image priority src={AvatarIcon} alt="Avatar" className="bg-primary-200 w-24 rounded-full border border-primary-200" />
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
                        <Dialog.Root>
                            <Dialog.Trigger asChild>
                                <button className="w-1/2 py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-lg transition duration-300">Edit Profile</button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="bg-black opacity-75 fixed inset-0"/>
                                <Dialog.Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                                    <Dialog.Title className="m-0 font-semibold text-xl">Edit Profile</Dialog.Title>
                                    <Dialog.Description className="mt-3 mb-6 text-md">
                                        Change your username or password here. Click save when you're done if you want changes to persist.
                                    </Dialog.Description>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="username">
                                            Username
                                        </label>
                                        <input className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" id="username" placeholder="(Optional)"defaultValue="" />
                                    </fieldset>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="old-password">
                                            Old Password
                                        </label>
                                        <input className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" id="old-password" defaultValue="" />
                                    </fieldset>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="new-password1">
                                            New Password
                                        </label>
                                        <input className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" id="new-password1" defaultValue="" />
                                    </fieldset>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="new-password2">
                                            Re-enter Password
                                        </label>
                                        <input className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" id="new-password2" defaultValue="" />
                                    </fieldset>
                                    <div className="flex flex-end justify-end mt-5">
                                        <Dialog.Close asChild>
                                            <ButtonWhite value={"Save Changes"} onClick={handleUpdateProfile}/>
                                        </Dialog.Close>
                                    </div>
                                    <Dialog.Close asChild>
                                        <button className="h-5 w-5 inline-flex items-center justify-center absolute top-5 right-5 hover:border border-primary-200 rounded" aria-label="Close">
                                            <Cross />
                                        </button>
                                    </Dialog.Close>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                        <button className="w-1/2 py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-lg transition duration-300">Logout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileCard;