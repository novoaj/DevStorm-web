'use client'
import React, { useState, useContext } from 'react';
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { notifications } from '../../../utils/notifications';

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
            <form className="animate-slideDown max-w-96 bg-primary-300 border border-slate-500 text-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-1/2 md:w-4/6 s:w-full xs:w-full" onSubmit={handleSubmit}>
                <div>
                    <h3 className="flex justify-center items-center text-3xl mb-5">Login</h3>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow bg-primary-100 appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow bg-primary-100 appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
                <div className="flex items-center mt-10">
                    <p>Don't have an account yet? <Link className="text-blue-400" href="/auth/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;