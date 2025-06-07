"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
import ltIcon from "../../../../public/images/lt_Icon.png";
import EditProfileList from "./EditProfileList";
import { useUserData } from "../../context/UserDataContext";

const EditProfile = () => {
    const router = useRouter();
    const { user, loading } = useUserData();

    const goBack = () => {
        router.back();
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-primary-300 text-slate-200 justify-center items-center">
                <div className="animate-pulse">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen bg-primary-300 text-slate-200 justify-center items-center">
                <div>Failed to load profile data</div>
            </div>
        );
    }

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
                    <EditProfileList user={user} />
                </div>
            </div>
        </>
    );
}

export default EditProfile;