"use client"
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';
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

interface ProjectDashboardProps {
    
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ }) => {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>();
    const handleSeeMore = (projectId : string) => {
        router.push(`/project?pid=${projectId}`)
    }

    const handleAddProject = () => {
        if (projects && projects.length > 0) {
            // show error message if user already has a project
            toast.warning("You can only have one project in progress at a time.");
        } else {
            // navigate to create project page
            router.push("/create-project");
        }
    }
    const handleDelete = (pid: string) => {
        console.log(pid);
        axiosInstance.delete(`${process.env.NEXT_PUBLIC_API_URL}/project/${pid}/delete`, {
            withCredentials: true
        })
        .then(response => {
            toast.success("Successfully deleted project.");
            setProjects(prevProjects => prevProjects?.filter(project => project.id !== pid)); // on success, update local projects to reflect change
        })
        .catch(error => {
            toast.error("Error deleting project.");
            console.error("Error deleting project:", error);
        });
    }

    // on component render, fetch this user's projects
    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/project/by-user";
        const getData = async() => {
            console.log("fetch /project/by-user")
            try {
                const response = await axiosInstance.get(url, {
                    withCredentials: true
                });
                // console.log(response.data);
                setProjects(response.data);
            }catch (err){
                setProjects([])
            }
            
        }   
        getData(); 
    }, [])
    return (
        <div className="flex-1 mt-5 bg-primary-300 h-96 w-full border border-primary-200 p-5 rounded-md">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl text-gray font-semibold mb-4" id="dashboard-heading">Dashboard</h2>
                <button onClick={handleAddProject} className="justify-center bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300 px-3 py-1">Add Project</button>
            </div>

            {projects === undefined ? (
                <div className="flex justify-center items-center">
                    <Spinner/>
                </div>
            ) : (
                <>
                    {projects.length === 0 ? 
                        <p className="text-gray text-center">You dont have any projects yet. Add one to get started!</p> 
                    : 
                        <table className="w-full border-collapse text-gray bg-primary-400" aria-labelledby="dashboard-heading">
                            <thead>
                                <tr>
                                    <th className="border border-primary-200 bg-primary-300 p-2" scope="col">Projects</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project : Project) => (
                                    <tr key={project.id}>
                                        <td className="border border-primary-200 p-2 flex justify-between">
                                            <button onClick={() => handleSeeMore(project.id)} className="text-blue-500 hover:underline text-left" aria-label={`See more details about ${project.title}`}>
                                                {project.title}
                                            </button>
                                            <Dialog.Root>
                                                <Dialog.Trigger asChild>
                                                    <DeleteIcon/>
                                                </Dialog.Trigger>
                                                <Dialog.Portal>
                                                <div className="flex justify-between items-center">
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
                                                </div>
                                                </Dialog.Portal>
                                            </Dialog.Root>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                }
                </>
                
                
            )}
        </div>
    );
};

export default ProjectDashboard;