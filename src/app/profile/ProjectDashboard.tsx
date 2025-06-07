"use client"
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as Dialog from "@radix-ui/react-dialog";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../axiosInstance';
import { ProjectActions } from './ProjectActions';
import { ProjectTable } from './ProjectTable';

interface Project {
    id: string;
    languages: string[];
    title: string;
    steps: string[];
    summary: string;
    username: string;
}

interface ProjectDashboardProps {
    initialProjects?: Project[];
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ initialProjects = [] }) => {
    const router = useRouter();
    // Use initial data from server
    const [projects, setProjects] = useState<Project[]>(initialProjects); // TODO look at how this is working

    return (
        <div className="flex-1 mt-5 bg-primary-300 h-96 w-full border border-primary-200 p-5 rounded-md">
            <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-2xl text-gray font-semibold" id="dashboard-heading">Dashboard</h2>
                <ProjectActions projectCount={projects.length} />
            </div>

            {projects.length === 0 ? 
                <p className="text-gray text-center">You dont have any projects yet. Add one to get started!</p> 
            : 
                <ProjectTable projects={projects} />
            }
        </div>
    );
};

export default ProjectDashboard;