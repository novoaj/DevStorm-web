"use client";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from 'next/navigation';
import handImg from "../../../public/images/home/ai-hand-clipart.webp";
import codeImg from "../../../public/images/home/code-screen-clipart.webp";
import collabImg from "../../../public//images/home/collab-clipart.webp";

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
        <div id="wrapper">
            <div id="section-intro" className="text-center min-h-screen content-center">
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
            <div id="section-one" className="flex flex-col w-full">
                <section className="flex flex-row bg-bluegray-100">
                    <div id="section-image">
                        <img src={handImg.src} alt="ai hand clipart" className="w-96 object-cover"/>
                    </div>
                    <div id="section-content" className="p-3 flex-1 content-center">
                        <h2 className="text-3xl pb-2">Project ideas that will stand out</h2>
                        <p>Our generated project ideas focus on leading technologies/languages used in the industries that interest users the most, giving our users valuable insights that will help them to explore career paths that interest them.</p>
                    </div>
                </section>
                <section className="flex flex-row bg-bluegray-200">
                    <div id="section-image">
                        <img src={codeImg.src} alt="ai hand clipart" className="w-96 object-cover"/>
                    </div>
                    <div id="section-content" className="p-3 flex-1 content-center">
                        <h2 className="text-3xl pb-2">Guidance Through Your Coding Journey</h2>
                        <p>Our platform provides step-by-step instructions and resources to help you navigate the programming process of your project, ensuring you gain valuable coding skills along the way.</p>
                    </div>
                </section>
                <section className="flex flex-row bg-bluegray-300">
                    <div id="section-image">
                        <img src={collabImg.src} alt="ai hand clipart" className="w-96 object-cover"/>
                    </div>
                    <div id="section-content" className="p-3 flex-1 content-center">
                        <h2 className="text-3xl pb-2">Collaborate and Grow Together</h2>
                        <p>Our platform fosters collaboration by connecting you with like-minded individuals, allowing you to work together on programming projects, share knowledge, and grow your skills as a team.</p>
                    </div>
                </section>
            </div>
        </div>
        
    );
}