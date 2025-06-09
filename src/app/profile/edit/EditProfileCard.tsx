"use client";
import Image from "next/image";
import gtIcon from "../../../../public/images/gt_Icon.png"; // TODO webp maybe
import { useState } from "react";
import { ProfileItem } from "./ProfileInterfaces";
import { Close, Content, Description, Overlay, Portal, Root, Title, Trigger } from "@radix-ui/react-dialog";
import Cross from "@/app/components/Cross";

const EditProfileCard: React.FC<ProfileItem> = ({title, description, popup: PopupComponent, user, initialData, handleSubmit }) => {
    const [btnStyle, setBtnStyle] = useState("bg-primary-300 rounded-full px-3");
    const [formData, setFormData] = useState(initialData);
    const [valid, setValid] = useState(false);

    const handleSetValid = (valid : boolean) => {
        setValid(valid);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData : any) => ({
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
                    <PopupComponent formData={formData} onChange={handleChange} handleSetValid={handleSetValid}/>
                    <div className="flex flex-end justify-between mt-5">
                        <Close asChild>
                            <button
                                className="w-fit py-2 px-4 ml-2 bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300"
                                onClick={() => handleSubmit(formData)}
                                disabled={!valid}
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