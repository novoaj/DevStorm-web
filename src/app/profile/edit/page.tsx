"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
import ltIcon from "../../../../public/images/lt_Icon.png";
import EditProfileList from "./EditProfileList";
import { useEffect, useState } from "react";
import { User } from "./ProfileInterfaces";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "sonner";

const EditProfile = () => {
    const router = useRouter();

    const goBack = () => {
        router.back();
    }
    const [user, setUser] = useState<User>()
    // TODO: these are called twice, once in profile, once in this component
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };
    function fetchData(url : string){
        const getData = async() => {
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
                toast.info("Error loading profile details");
                }
        }  
        getData(); 
    }
    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/user/info";
        fetchData(url);
    }, [])
    return (
        <>
            <div className="flex flex-col sm:w-5/6 xs:w-5/6 md:w-3/4 lg:w-4/5 xl:w-4/5 2xl:w-4/5 min-h-screen bg-primary-300 text-slate-200 justify-self-center justify-start mx-auto">
                <div>
                    <button
                        className="flex flex-row justify-self-start items-center bg-primary-300 hover:bg-primary-100 text-gray px-4 py-2 my-3 rounded-full mb-4 transition duration-300"
                        onClick={goBack}
                    >
                        <Image
                            src={ltIcon}
                            height={20}
                            width={20}
                            alt="Less than sign"
                        />
                        <p className="text-slate-200 text-lg ml-3">Back to profile overview</p>
                    </button>
                </div>
                <div className="ml-3">
                    <p className="text-3xl mb-5">Edit Profile</p>
                    {user && <EditProfileList user={user} />}
                </div>
            </div>
           
        </>
    );
}

export default EditProfile;