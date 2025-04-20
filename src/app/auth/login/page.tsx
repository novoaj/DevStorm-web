'use client'
import React, { useState, useContext } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { notifications } from '../../../utils/notifications';
import Preview from './loading';
import LoginForm from './LoginForm';

export const validateLoginInputs = (username : string, password : string) => {
    if (username === "" || password === ""){
        notifications.info.loginRequired();
        return false
    }
    return true
}

export const handleLoginSubmit = async (
    username: string,
    password: string,
    setIsLoggedIn: (value: boolean) => void,
    router: { push: (path: string) => void }
) => {
    if (!validateLoginInputs(username, password)) {
        return { success: false };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;
    try {
        const response = await axios.post(url, {
            username: username,
            password: password
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        setIsLoggedIn(true);
        notifications.success.login();
        return { success: true };
    } catch (error) {
        console.log(error);
        notifications.warning.loginFailed();
        return { success: false };
    }
};

function LoginPage() {
    const [loading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);
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
        const{ username, password } = formData;
        setIsLoading(true);
        let loginStatus = await handleLoginSubmit(username, password, setIsLoggedIn, router);
        if (loginStatus.success) {
            router.push("/profile");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
            {loading ? 
                <Preview/> : 
                <LoginForm onSubmit={handleSubmit} formData={formData} handleChange={handleChange}/>
                }
        </div>
    );
}

export default LoginPage;