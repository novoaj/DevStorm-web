"use client";
import { useUser } from "../context/UserContext";
import CreateProjectForm from "./components/CreateProjectForm";

const CreateProject: React.FC = () => {
    const { isLoggedIn } = useUser();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-300 to-primary-400">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-primary-300 rounded-lg p-8 mb-8 text-center">
                        <h1 className="text-4xl font-bold text-slate-100 mb-2">Create Your Project</h1>
                        <p className="text-slate-300">Generate personalized project ideas based on your interests and career goals</p>
                    </div>

                    {/* Main Content */}
                    {isLoggedIn ? (
                        <CreateProjectForm />
                    ) : (
                        <div className="bg-primary-300 border border-slate-500 rounded-lg p-8 text-center">
                            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Authentication Required</h2>
                            <p className="text-slate-300 mb-6">Please log in or sign up to create a project</p>
                            <div className="space-x-4">
                                <a href="/auth/login" className="bg-secondary-100 hover:bg-secondary-200 text-slate-100 px-6 py-2 rounded-full transition-colors">
                                    Log In
                                </a>
                                <a href="/auth/register" className="bg-primary-200 hover:bg-primary-100 text-slate-200 px-6 py-2 rounded-full border border-slate-500 transition-colors">
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProject;