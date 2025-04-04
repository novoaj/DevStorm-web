'use client'
import React, { useState, useContext } from 'react';
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { notifications } from '../../../utils/notifications';
import FormInput from '@/components/common/FormInput';
import FormButton from '@/components/common/FormButton';

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
        router.push("/profile");
        return { success: true };
    } catch (error) {
        console.log(error);
        notifications.warning.loginFailed();
        return { success: false };
    }
};

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const router = useRouter();

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleLoginSubmit(username, password, setIsLoggedIn, router);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
            <form className="animate-slideDown max-w-md w-full bg-primary-300 border border-slate-500 text-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div>
                    <h3 className="flex justify-center items-center text-3xl mb-5">Login</h3>
                </div>

                <FormInput
                    id="username"
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <FormInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <div className="flex items-center justify-between mt-10">
                    <FormButton text="Submit" type="submit"/>
                </div>
                <div className="flex items-center mt-10">
                    <p>Don't have an account yet? <Link className="text-blue-400" href="/auth/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;