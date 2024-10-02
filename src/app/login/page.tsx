'use client'
import React, { useState, useContext } from 'react';
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserContext } from '../context/UserContext';

const LoginPage: React.FC = () => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let url = "http://127.0.0.1:5000/login"
        // validate inputs
        if (username === "" || password === ""){
            toast.info("You must enter a valid username and password to continue", {
                duration: 2000,
            });
            return;
        }

        axios.post(url, {
            username: username,
            password: password
        }, {
            withCredentials: true, // Include this to handle cookies
            headers: {
                'Content-Type': 'application/json'
            },
            
        })
        .then((response) => {
            if (response.status === 200) {
                setIsLoggedIn(true); // update user context
                toast.success('Successful Login!', {
                    duration: 2000,
                });
                router.push("/");
            
            } else if (response.status >= 400) {
                // If login fails, show a warning toast
                toast.warning('Login failed, make sure your username and password is correct', {
                    duration: 2000,
                });
            }
        })
        .catch((error) => {
            // If there's an error with the request, show a warning toast
            console.log(error);
            toast.warning('Login failed. Make sure your username and password is correct.', {
            duration: 5000,
            });
        })
    };

    return (
        <div className="flex justify-center items-center h-screen">
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
                        Sign In
                    </button>
                </div>
                <div className="flex items-center mt-10">
                    <p>Don't have an account yet? <Link className="text-blue-400" href="/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;