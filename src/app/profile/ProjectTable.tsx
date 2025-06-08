"use client"
import React, { useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as Dialog from "@radix-ui/react-dialog";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../axiosInstance';

interface Project {
    id: string;
    languages: string[];
    title: string;
    steps: string[];
    summary: string;
    username: string;
}

interface ProjectTableProps {
    projects: Project[];
}
export const ProjectTable: React.FC<ProjectTableProps> = function ProjectTableComponent({ projects: initialProjects }) {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>(initialProjects);

    const handleSeeMore = (projectId: string) => {
        router.push(`/project?pid=${projectId}`);
    }

    const handleDelete = async (pid: string) => {
        try {
            await axiosInstance.delete(`/project/${pid}/delete`, {
                withCredentials: true
            });
            
            toast.success("Successfully deleted project.");
            setProjects(prevProjects => prevProjects.filter(project => project.id !== pid));
        } catch (error) {
            toast.error("Error deleting project.");
            console.error("Error deleting project:", error);
        }
    }

    return (
        <table className="w-full border-collapse text-gray bg-primary-400" aria-labelledby="dashboard-heading">
            <thead>
                <tr>
                    <th className="border border-primary-200 bg-primary-300 p-2" scope="col">Projects</th>
                </tr>
            </thead>
            <tbody>
                {projects.map((project: Project) => (
                    <tr key={project.id}>
                        <td className="border border-primary-200 p-2 flex justify-between">
                            <button 
                                onClick={() => handleSeeMore(project.id)} 
                                className="text-blue-500 hover:underline text-left" 
                                aria-label={`See more details about ${project.title}`}
                            >
                                {project.title}
                            </button>
                            <Dialog.Root>
                                <Dialog.Trigger asChild>
                                    <DeleteIcon className="cursor-pointer hover:text-red-500 transition-colors"/>
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                    <Dialog.Overlay className="bg-black opacity-75 fixed inset-0" />
                                    <Dialog.Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                                        <Dialog.Title className="m-0 font-semibold text-xl">Delete Project</Dialog.Title>
                                        <Dialog.Description className="mt-3 mb-6 text-md">
                                            Are you sure you want to delete the project &quot;{project.title}&quot;? This action cannot be undone.
                                        </Dialog.Description>
                                        <div className="flex justify-end mt-5">
                                            <Dialog.Close asChild>
                                                <button
                                                    className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    Delete
                                                </button>
                                            </Dialog.Close>
                                            <Dialog.Close asChild>
                                                <button className="py-2 px-4 ml-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300">
                                                    Cancel
                                                </button>
                                            </Dialog.Close>
                                        </div>
                                    </Dialog.Content>
                                </Dialog.Portal>
                            </Dialog.Root>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
