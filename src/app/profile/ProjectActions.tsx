"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProjectActionsProps {
    projectCount: number;
}

export const ProjectActions: React.FC<ProjectActionsProps> = ({ projectCount }) => {
    const router = useRouter();

    const handleAddProject = () => {
        if (projectCount > 0) {
            toast.warning("You can only have one project in progress at a time.");
        } else {
            router.push("/create-project");
        }
    }

    return (
        <button 
            onClick={handleAddProject} 
            className="justify-center bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300 px-3 py-1"
        >
            Add Project
        </button>
    );
};