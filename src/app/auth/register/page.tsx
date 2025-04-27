'use client'
import React, { useState } from 'react';
import { useRouter} from "next/navigation";
import RegisterForm from './RegisterForm';
import { handleRegisterSubmit } from './registerUtils';


const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
            email: '',
            username: '',
            password: '',
            password2: '',
        });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {email, username, password, password2} = formData;
        await handleRegisterSubmit(username, password, password2, email, router);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
            <RegisterForm onSubmit={handleSubmit} formData={formData} handleChange={handleChange}/>
        </div>
    );
};

export default RegisterPage;