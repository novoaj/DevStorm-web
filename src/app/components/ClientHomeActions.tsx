"use client";

import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from 'next/navigation';

export const ClientHomeActions = () => {
    const { isLoggedIn, isLoading } = useContext(UserContext);
    const router = useRouter();

    const handleCTA = () => {
        if (isLoggedIn) {
            router.push('/create-project');
        } else {
            router.push('/auth/register');
        }
        setTimeout(() => console.log("HadnelCTA"), 2000)
    };
    
    if (isLoading) {
        return (
            <button
                disabled
                className="bg-primary-300 border border-primary-200 text-slate-300 text-sm font-bold py-2 px-4 rounded-full opacity-75"
            >
                Loading...
            </button>
        );
    }
    return (
        <>
            <button
                onClick={handleCTA}
                className="bg-primary-300 border border-primary-200 hover:bg-primary-100 text-slate-300 text-sm font-bold py-2 px-4 rounded-full transition duration-300"
            >
                {isLoggedIn ? 'Create a Project' : 'Create an Account'}
            </button>
            {!isLoggedIn && (
                <p className="mt-4 text-slate-300">
                    Already have an account? <a href="/auth/login" className="text-blue-400 hover:underline">Login</a>
                </p>
            )}
        </>
    );
};
