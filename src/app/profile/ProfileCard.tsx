"use client"
import React, {useContext, useEffect, useState} from 'react';
import Image from "next/image";
import AvatarIcon from "../../../public/images/avatar-default.svg";
import axiosInstance from "../axiosInstance";
import {useRouter} from 'next/navigation';
import Spinner from '../components/Spinner';
import { toast } from 'sonner';
import { UserContext } from '../context/UserContext';
import { User } from './edit/ProfileInterfaces';
// import EditProfilePopup from './EditProfilePopup';

interface ProfileCardProps {
    
}

const ProfileCard: React.FC<ProfileCardProps> = ({ }) => {
    const [user, setUser] = useState<User>()
    const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const [formData, setFormData] = useState({
        //email: '',
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
        console.log(formData);
    };
    const router = useRouter();

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    const handleUpdateUsername = async() => {
        if (user && user.username !== formData.username){
            // update username
            if (formData.username.length < 5) {
                toast.error("New username must be 5+ characters")
            }
            try{
                let url = process.env.NEXT_PUBLIC_API_URL + `/user/update-username`;
                let response = await axiosInstance.put(url, {
                    new_username: formData.username,
                    current_password: formData.oldPassword
                })
                if (response.status === 200) {
                    toast.success("Reset Username")
                }
            }catch (err) {
                console.error(err);
                toast.error("Error resetting Username. This username might be taken. Make sure password is filled in correctly")
            }
        }
        // TODO useState for password/username changes to form. hit update api endpoint
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
            router.replace("/auth/login");
        }catch (err) {
            toast.success('Logged out');
            setIsLoggedIn(false); // log user out even if it fails
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
    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/user/info";
        const getData = async() => {
            console.log("fetch /user/info");
            try {
                const response = await axiosInstance.get(url);
                //console.log(response);
                if (response){
                    setUser({
                        username: response.data.username,
                        email: response.data.email,
                        dateJoined: formatDate(response.data.date_joined),
                        projects: response.data.projects,
                        projectsCompleted: response.data.projects_completed,
                    });
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
                        <button className="w-1/2 py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-full transition duration-300" onClick={editProfilePage}>Edit Profile</button>
                        {/* <EditProfilePopup formData={formData} onChange={handleChange} onSave={handleUpdateProfile} onDelete={deleteAccount}/> */}
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