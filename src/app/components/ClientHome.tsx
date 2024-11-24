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
        <div id="wrapper" className="w-full overflow-x-hidden">
            <div id="section-intro" className="text-center min-h-[calc(100vh-96px)] content-center">
                <div id="intro-content" className="w-full min-w-min md:px-64 px-12 text-left">
                    <h1 className="text-5xl text-slate-50 font-bold mb-4">DevStorm</h1>
                    <p className="text-lg text-slate-300 mb-8">Your guide to exploring tech careers through project-based learning.</p>
                    <button 
                        onClick={handleCTA} 
                        className="bg-primary-300 border border-primary-200 hover:bg-primary-100 text-slate-200 text-sm font-bold py-2 px-4 rounded-full transition duration-300"
                    >
                        {isLoggedIn ? 'Create a Project' : 'Create an Account'}
                    </button>
                    {!isLoggedIn && (
                        <p className="mt-4 text-slate-300">
                            Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
                        </p>
                    )}
                </div>
            </div>
            <div id="section-one" className="flex flex-col w-full">
                <section className="flex flex-col md:flex-row bg-bluegray-100">
                    <div id="section-image" className="w-full md:w-96 min-w-0">
                        <img src={handImg.src} alt="ai hand clipart" className="w-full object-cover"/>
                    </div>
                    <div id="section-content" className="px-12 py-8 md:p-8 flex-1 min-w-0 content-center">
                        <h2 className="text-4xl pb-4 text-slate-50">Project ideas that will stand out</h2>
                        <p className="text-sm md:text-base text-slate-200">Our generated project ideas focus on leading technologies/languages used in the industries that interest users the most, giving our users valuable insights that will help them to explore career paths that interest them.</p>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row bg-bluegray-200">
                    <div id="section-image" className="w-full md:w-96 min-w-0">
                        <img src={codeImg.src} alt="ai hand clipart" className="w-full object-cover"/>
                    </div>
                    <div id="section-content" className="px-12 py-8 md:p-8 flex-1 min-w-0 content-center">
                        <h2 className="text-4xl pb-2 text-slate-50">Guidance Through Your Coding Journey</h2>
                        <p className="text-sm md:text-base text-slate-200">Our platform provides step-by-step instructions and resources to help you navigate the programming process of your project, ensuring you gain valuable coding skills along the way.</p>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row bg-bluegray-300">
                    <div id="section-image" className="w-full md:w-96 min-w-0">
                        <img src={collabImg.src} alt="ai hand clipart" className="w-full object-cover"/>
                    </div>
                    <div id="section-content" className="px-12 py-8 md:p-8 flex-1 min-w-0 content-center">
                        <h2 className="text-4xl pb-2 text-slate-50">Collaborate and Grow Together</h2>
                        <p className="text-sm md:text-base text-slate-200">Our platform fosters collaboration by connecting you with like-minded individuals, allowing you to work together on programming projects, share knowledge, and grow your skills as a team.</p>
                    </div>
                </section>
            </div>
            <div id="section-two" className="flex flex-col w-full">
                <div id="section-two-content" className="flex flex-col bg-secondary-100 py-12 px-8">
                    <div id="section-two-header pt-8">
                        <h2 className="text-4xl pb-2 text-slate-50">Building Projects with Devstorm</h2>
                        <p className="text-slate-300" >Our product is a platform that allows users to generate project ideas, follow step-by-step instructions to complete their projects, and collaborate with others to learn and grow together.</p>
                    </div>
                    <div id="section-two-features">
                        <section className="my-12 grid grid-cols-1 md:grid-cols-2">
                            <div id="feature-1" className="border md:rounded-t-md border-secondary-200 p-5">
                                <h2 className="text-2xl pb-2 text-slate-50">Personalized Project Generation</h2>
                                <p className="text-slate-300">
                                    Tell us about your career goals and interests, and we'll help you create projects that align with your path. 
                                    By understanding your target tech roles, programming experience, and industry interests, our AI generates 
                                    project ideas that are perfectly tailored to help you build relevant skills and explore your future career.
                                </p>
                            </div>
                            <div id="feature-2" className="border border-secondary-200 p-5">
                                <h2 className="text-2xl pb-2 text-slate-50">Step-by-Step Guidance</h2>
                                <p className="text-slate-300">
                                    Never feel lost in your project journey. Each project comes with AI-generated, detailed instructions that 
                                    break down complex tasks into clear, actionable steps. Whether you're building a web app or creating a data 
                                    analysis tool, you'll always know what to do next.
                                </p>
                            </div>
                            <div id="feature-3" className="border border-secondary-200 p-5">
                                <h2 className="text-2xl pb-2 text-slate-50">Progress Tracking</h2>
                                <p className="text-slate-300">
                                    Stay motivated with our intuitive progress tracking system. Mark tasks as complete, monitor your project's 
                                    development, and maintain momentum throughout your learning journey. Our organized approach helps you 
                                    transform ambitious project ideas into completed portfolio pieces.
                                </p>
                            </div>
                            <div id="feature-4" className="border md:rounded-b-md border-secondary-200 p-5">
                                <h2 className="text-2xl pb-2 text-slate-50">Project Portfolio</h2>
                                <p className="text-slate-300">
                                    Build a compelling portfolio of projects that demonstrates your skills to potential employers. Each completed 
                                    project serves as tangible proof of your abilities, showcasing not just what you've built, but the 
                                    industry-relevant technologies and concepts you've mastered along the way.
                                </p>
                            </div>
                        </section>
                        <button 
                            onClick={handleCTA} 
                            className="bg-secondary-100 border border-secondary-200 hover:bg-secondary-200 text-slate-200 text-sm font-bold py-2 px-4 mb-3 rounded-full transition duration-300"
                        >
                            {isLoggedIn ? 'Create a Project' : 'Create an Account'}
                        </button>
                    </div>
                </div>
            </div>
            <div id="section-footer" className="flex flex-col w-full bg-primary-300 py-12 px-12">
                <h2 className="text-4xl pb-4 text-slate-50">Contact Us</h2>
                <p className="text-slate-300 mb-6">We'd love to hear your feedback!</p>
                
                <form className="max-w-2xl">
                    {/* Row 1: Name and Email */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                className="w-full p-2 rounded-md bg-primary-200 border border-primary-300 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-100"
                            />
                        </div>
                        <div className="flex-1">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full p-2 rounded-md bg-primary-200 border border-primary-300 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-100"
                            />
                        </div>
                    </div>

                    {/* Row 2: Message */}
                    <div className="mb-4">
                        <textarea 
                            placeholder="Your message" 
                            rows={4}
                            className="w-full p-2 rounded-md bg-primary-200 border border-primary-300 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-100"
                        />
                    </div>

                    {/* Row 3: Submit Button */}
                    <div>
                        <button 
                            type="submit"
                            className="bg-primary-200 border border-primary-300 hover:bg-primary-100 text-slate-200 text-sm font-bold py-2 px-4 rounded-full transition duration-300"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    );
}