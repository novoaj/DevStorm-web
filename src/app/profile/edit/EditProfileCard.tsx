"use client";
import Image from "next/image";
import gtIcon from "../../../../public/images/gt_Icon.png";
import { useEffect, useState } from "react";
import { ProfileItem, User } from "./ProfileInterfaces";
import { Close, Content, Description, Overlay, Portal, Root, Title, Trigger } from "@radix-ui/react-dialog";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "sonner";
import Cross from "@/app/components/Cross";

const EditProfileCard: React.FC<ProfileItem> = ({title, description, popup: PopupComponent, user }) => {
    const [btnStyle, setBtnStyle] = useState("bg-primary-300 rounded-full px-3");
    const [formData, setFormData] = useState({
        username: user.username,
        password: ""
    });
    

    const handleUpdateUsername = async(username : string, password : string) => {
        if (user && user.username !== username){
            // update username
            if (formData.username.length < 5) {
                toast.error("New username must be 5+ characters")
            }
            try{
                let url = process.env.NEXT_PUBLIC_API_URL + `/user/update-username`;
                let response = await axiosInstance.put(url, {
                    new_username: username,
                    current_password: password
                })
                if (response.status === 200) {
                    setFormData({
                        username: user.username,
                        password: ""
                    });
                    toast.success("Reset Username")
                }
            }catch (err) {
                console.error(err);
                setFormData({
                    username: user.username,
                    password: ""
                });
                toast.error("Error resetting username. This username might be taken. Make sure password is filled in correctly")
            }
        }else{
            toast.error("Failed to change username.")
        }
        // TODO useState for password/username changes to form. hit update api endpoint
        return;
    }
    const handleSubmit = async (e: React.FormEvent) => { // TODO handlesubmit different depending on the popup
        e.preventDefault();
        const{ username, password } = formData;
        console.log("update username")
        await handleUpdateUsername(username, password);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    return (
        <Root>
            <Trigger asChild>
                <button className="w-full my-3">
                    <div 
                        className="flex flex-row justify-between"
                        onMouseEnter={() => setBtnStyle("bg-primary-200 rounded-full px-3 flex items-center")}
                        onMouseLeave={() => setBtnStyle("bg-primary-300 rounded-full px-3 flex items-center")}>
                        <div className="flex flex-col items-start">
                            <p className="text-md">{title}</p>
                            <p className="text-sm text-slate-300">{description}</p>
                        </div>
                        <div className={btnStyle}>
                            <Image
                                className="items-center"
                                src={gtIcon}
                                height={20}
                                width={20}
                                alt="Greater than sign"
                            />
                        </div>
                    </div>
                </button>
            </Trigger>
            <Portal>
                <Overlay className="bg-black opacity-75 fixed inset-0"/>
                <Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                    <Title className="m-0 font-semibold text-xl">{title}</Title>
                    <Description className="mt-3 mb-6 text-md text-slate-300">
                        {description}
                    </Description>
                    <PopupComponent formData={formData} onChange={handleChange}/>
                    <div className="flex flex-end justify-between mt-5">
                        <Close asChild>
                            <button
                                className="w-fit py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300"
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </button>
                        </Close>
                    </div>
                    <Close asChild>
                        <button className="h-5 w-5 inline-flex items-center justify-center absolute top-5 right-5 hover:border border-primary-200 rounded" aria-label="Close">
                            <Cross />
                        </button>
                    </Close>
                </Content>
            </Portal>
        </Root>
    );
}

export default EditProfileCard;