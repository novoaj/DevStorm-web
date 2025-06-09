"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { memo, useCallback } from 'react';

const ClientHomeActions = () => {
    const { isLoggedIn } = useUser();
    const router = useRouter();

    const handleCTA = useCallback(() => {
        if (isLoggedIn) {
            router.push('/create-project');
        } else {
            router.push('/auth/register');
        }
    }, [isLoggedIn, router]);

    return (
        <div className="flex flex-col items-start">
            <button
                onClick={handleCTA}
                aria-label={isLoggedIn ? 'Create a new project' : 'Create an account to get started'}
                className="bg-primary-300 border border-primary-200 hover:bg-primary-100 text-slate-300 text-sm font-bold py-2 px-4 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
                {isLoggedIn ? 'Create a Project' : 'Create an Account'}
            </button>
            {!isLoggedIn && (
                <p className="mt-4 text-slate-300">
                    Already have an account?{' '}
                    <Link 
                        href="/auth/login" 
                        className="text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                        prefetch={false}
                    >
                        Login
                    </Link>
                </p>
            )}
        </div>
    );
};

// Memoize component to prevent unnecessary re-renders
export default memo(ClientHomeActions);
