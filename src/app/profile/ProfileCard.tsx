"use client"
import React, {useContext, useEffect, useState} from 'react';
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import AvatarIcon from "../../../public/images/avatar-default.svg";
import ButtonWhite from '../components/ButtonWhite';
import Cross from '../components/Cross';
import axiosInstance from "../axiosInstance";
import {useRouter} from 'next/navigation';
import Spinner from '../components/Spinner';
import { toast } from 'sonner';
import { UserContext } from '../context/UserContext';

interface User {
    username: string;
    email: string;
    dateJoined: string;
    projects: number;
    projectsCompleted: number;
}

interface ProfileCardProps {
    
}

const ProfileCard: React.FC<ProfileCardProps> = ({ }) => {
    const [user, setUser] = useState<User>()
    const [username, setUsername] = useState("");
    const [usernameEdited, setUsernameEdited] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [setPassword, setSetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [updatePassword, setUpdatePassword] = useState(false);
    const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);

    const router = useRouter();

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setUsernameEdited(true);
    }
    const handleChangeOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value);
        if (e.target.value === ""){
            setSetPassword(false);
            return;
        }
        setSetPassword(true);
    }
    const handleChangeNewPassword= (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        if (e.target.value === ""){
            setUpdatePassword(false);
            return;
        }
        setUpdatePassword(true);
    }
    const handleChangeNewPassword2= (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === ""){
            setUpdatePassword(false);
            return;
        }
        setNewPassword2(e.target.value);
    }
    const handleUpdateProfile = async() => {
        // validate passwords match
        if (updatePassword) {
            if (newPassword === "" || newPassword2 === "") {
                toast.error("All password fields must be filled out in order to reset them");
                return;
            }
            if (newPassword !== newPassword2){
                toast.error("New Passwords must match!");
                return;
            }
            if (newPassword.length < 6){
                toast.error("Password must be at least 6 characters!");
                return;
            }
            console.log("update password")
            try{
                let url = process.env.NEXT_PUBLIC_API_URL + `/user/update-password`;
                let response = await axiosInstance.put(url, {
                    current_password: oldPassword,
                    new_password: newPassword
                })
                if (response.status === 200) {
                    toast.success("Reset password")
                }
            }catch (err) {
                console.error(err);
                toast.error("Error resetting password.")
            }
        }
        // TODO useState for password/username changes to form. hit update api endpoint
        if (usernameEdited){
            // update username
            try{
                let url = process.env.NEXT_PUBLIC_API_URL + `/user/update-username`;
                let response = await axiosInstance.put(url, {
                    new_username: username,
                    current_password: oldPassword
                })
                if (response.status === 200) {
                    toast.success("Reset password")
                }
            }catch (err) {
                console.error(err);
                toast.error("Error resetting password.")
            }
        }
        return;
    }

    const handleLogout = async() => {
        try{
            await axiosInstance.post(process.env.NEXT_PUBLIC_API_URL + "/logout", {}, 
            {
                withCredentials: true,
            })
        
            setIsLoggedIn(false);
            toast.success('Logged out');
            router.replace("/login");
        }catch (err) {
            toast.success('Logged out');
            setIsLoggedIn(false); // log user out even if it fails
            router.replace("/login");
        }
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
    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/user/info";
        const getData = async() => {
            try {
                const response = await axiosInstance.get(url);
                console.log(response);
                if (response){
                    setUser({
                        username: response.data.username,
                        email: response.data.email,
                        dateJoined: formatDate(response.data.date_joined),
                        projects: response.data.projects,
                        projectsCompleted: response.data.projects_completed,
                    });
                    setUsername(response.data.username);
                }
            }catch (e){
                setUser({
                    username: "",
                    email: "",
                    dateJoined: "",
                    projects: 0,
                    projectsCompleted:0,
                });
                // router.replace("/");
                // toast.info("Error loading profile details");
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
                                <button className="w-1/2 py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-full transition duration-300">Edit Profile</button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="bg-black opacity-75 fixed inset-0"/>
                                <Dialog.Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                                    <Dialog.Title className="m-0 font-semibold text-xl">Edit Profile</Dialog.Title>
                                    <Dialog.Description className="mt-3 mb-6 text-md">
                                        Change your username or password here. Click save when you're done if you want changes to persist (to change username, enter your current password)
                                    </Dialog.Description>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label 
                                            className="text-md bg-primary-400 w-48 text-left" 
                                            htmlFor="username"
                                        >
                                            Username
                                        </label>
                                        <input 
                                            className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" 
                                            id="username" 
                                            placeholder="(Optional)"
                                            value={username}
                                            onChange={handleChangeUsername}
                                        />
                                    </fieldset>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="old-password">
                                            Password
                                        </label>
                                        <input 
                                            className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" 
                                            id="old-password" 
                                            type='password'
                                            value={oldPassword}
                                            onChange={handleChangeOldPassword} />
                                    </fieldset>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="new-password1">
                                            New Password
                                        </label>
                                        <input 
                                            className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" 
                                            id="new-password1" 
                                            placeholder="Optional"
                                            type='password'
                                            disabled={!setPassword}
                                            value={newPassword}
                                            onChange={handleChangeNewPassword} />
                                    </fieldset>
                                    <fieldset className="flex gap-4 items-center mb-2">
                                        <label className="text-md bg-primary-400 w-48 text-left" htmlFor="new-password2">
                                            Re-enter Password
                                        </label>
                                        <input 
                                            className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" 
                                            id="new-password2"
                                            placeholder="Optional"
                                            type='password'
                                            disabled={!setPassword}
                                            value={newPassword2}
                                            onChange={handleChangeNewPassword2} 
                                        />
                                    </fieldset>
                                    <div className="flex flex-end justify-between mt-5">
                                        <Dialog.Close asChild>
                                            <button 
                                                className="h-fit w-fit p-2 px-4 flex flex-center items-center justify-center hover:border border-primary-200 bg-secondary-100 hover:bg-secondary-200 rounded-full ml-5" 
                                                aria-label="Delete account"
                                                onClick={deleteAccount}
                                            >
                                                Delete Acccount
                                            </button>
                                        </Dialog.Close>
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
                        <button 
                            className="w-1/2 py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileCard;