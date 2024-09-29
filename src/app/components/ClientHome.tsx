"use client";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from 'next/navigation';

// https://medium.com/@velja/token-refresh-with-axios-interceptors-for-a-seamless-authentication-experience-854b06064bde
export const ClientHome: React.FC<any> = ({}) => {
    const { isLoggedIn, setIsLoggedIn} = useContext(UserContext);

    const router = useRouter();
    const handleCTA = () => {
        if (isLoggedIn) {
          router.push('/create-project');
        } else {
          router.push('/register');
        }
      };
    return (
        <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to DevStorm!</h1>
            <p className="text-xl mb-8">Your guide to exploring tech careers through project-based learning.</p>
            
            <button 
                onClick={handleCTA} 
                className="bg-secondary-100 hover:bg-secondary-200 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                {isLoggedIn ? 'Create a Project' : 'Create an Account'}
            </button>

            {!isLoggedIn && (
                <p className="mt-4">
                    Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a>
                </p>
            )}
        </div>
    );
}