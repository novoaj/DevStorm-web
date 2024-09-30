"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    name: string;
}

interface UserProjects {
    projects: Project[];
}

interface ProjectDashboardProps {
    projects: UserProjects;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projects }) => {
    const router = useRouter();
    const handleSeeMore = (projectId : string) => {
        router.push(`/project?pid=${projectId}`)
    }
    return (
        <div className="flex-1 mt-5 bg-primary-300 h-96 w-full border border-primary-200 p-5 rounded-md">
            <h2 className="text-2xl text-gray font-semibold mb-4" id="dashboard-heading">Dashboard</h2>
            <table className="w-full border-collapse text-gray bg-primary-400" aria-labelledby="dashboard-heading">
                <thead>
                    <tr>
                        <th className="border border-primary-200 p-2" scope="col">Project</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.projects.map((project) => (
                        <tr key={project.id}>
                            <td className="border border-primary-200 p-2 flex justify-between">
                                <span className="text-left">{project.name}</span>
                                <button onClick={() => handleSeeMore(project.id)} className="text-blue-500 hover:underline text-right" aria-label={`See more details about ${project.name}`}>See More</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectDashboard;