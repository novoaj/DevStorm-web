'use client'
import React, { useState, useContext } from 'react';
import Link from "next/link";
import { useRouter} from "next/navigation";
import axios from "axios";
import { toast } from 'sonner';
import { UserContext } from '../context/UserContext';

// valiadtes user inputs before sending request to backend
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
    return {
        valid: !failedValidation,
        message: failedValidation?.message || 'No issues'
    };
};

// Move handleSubmit outside and export it
export const handleSubmit = async (username: string, password: string, password2: string, email: string) => {
    let result = validateInputs(username, password, password2);
    if (result.valid){
        let url = "http://127.0.0.1:5000/register"
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
            return { success: true };
        } catch (error) {
            console.log(error);
            toast.warning('Register failed (This username might already exist). Try again!', {
                duration: 2000,
            });
            return { success: false };
        }
    }else{
        toast.warning(result.message, {
            duration: 2000,
        });
        return { success: false };
    }
};

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);
    const router = useRouter()

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-96px)]">
            <form className="animate-slideDown bg-primary-300 max-w-96 border border-slate-500 text-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-1/2 md:w-4/6 s:w-full xs:w-full" 
                onSubmit={async (e) => {
                    e.preventDefault();
                    const result = await handleSubmit(username, password, password2, email);
                    if (result.success) {
                        router.push("/confirm");
                    }
                }}>
                <div>
                    <h3 className="flex justify-center items-center text-3xl mb-5">Register</h3>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow bg-primary-100 appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow bg-primary-100 appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
                        Re-enter password
                    </label>
                    <input
                        className="shadow bg-primary-100 appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password2"
                        type="password"
                        placeholder="Enter your password again"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                    >
                        Continue
                    </button>
                </div>
                <div className="flex items-center mt-10">
                    <p>Already have an account? <Link className="text-blue-400" href="/login">Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;