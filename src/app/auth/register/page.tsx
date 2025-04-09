'use client'
import React, { useState } from 'react';
import axios from "axios";
import { useRouter} from "next/navigation";
import { notifications } from '../../../utils/notifications';
import RegisterForm from './RegisterForm';

// validates user inputs before sending request to backend
export const validateInputs = (username: string, password: string, password2: string) => {
    const validations = [
        {
            condition: !username || !password || !password2,
            message: 'All fields must be filled in to register this account!'
        },
        {
            condition: password !== password2,
            message: 'Passwords must match!'
        },
        {
            condition: username.length < 5,
            message: 'Username must be at least 5 characters!'
        },
        {
            condition: password.length < 6,
            message: 'Password must be at least 6 characters!'
        }
    ];

    const failedValidation = validations.find(v => v.condition);
    if (failedValidation) {
        notifications.warning.registerValidation(failedValidation.message);
    }
    return {
        valid: !failedValidation,
        message: failedValidation?.message || 'No issues'
    };
};

// Move handleSubmit outside and export it
export const handleRegisterSubmit = async (
    username: string,
    password: string,
    password2: string,
    email: string,
    router: { push: (path: string) => void }
) => {
    const result = validateInputs(username, password, password2);
    if (result.valid) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/register`;
        try {
            await axios.post(url, {
                email: email,
                username: username,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            notifications.success.register();
            router.push("/confirm");
            return { success: true };
        } catch (error) {
            console.log(error);
            notifications.warning.registerFailed();
            return { success: false };
        }
    }
    return { success: false };
};

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