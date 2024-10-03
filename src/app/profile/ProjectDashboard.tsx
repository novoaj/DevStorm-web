"use client"
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { fetchCSRFToken } from '../actions/actions';
import Spinner from '../components/Spinner';

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
    // axios instance config and intercept for refresh
    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
        }
    });
    axiosInstance.interceptors.request.use(async request => {
        const csrfToken = await fetchCSRFToken(); // inject csrf token into each request with this instance
        if (csrfToken) {
            request.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        return request;
      }, error => {
        return Promise.reject(error);
      });
    axiosInstance.interceptors.response.use(
        response => response, // successful response
        async error => {
            // error response from server is intercepted
            const originalRequest = error.config; 
            // console.log(error); // response from server
            console.log(error.response.status, originalRequest._retry) // !undefined -> (true)
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // mark retry as true so we don't retry more than once
                try {
                    // console.log("refreshing refresh token");
                    const csrfToken = await fetchCSRFToken(); 
                    const response = await axios.post("http://127.0.0.1:5000/token/refresh", {
                        "X-CSRF-TOKEN": csrfToken
                    }, {
                        withCredentials: true,
                    })
                    return axiosInstance(originalRequest); 
                }catch (refreshError) {
                    // refresh token is expired, force logout
                    localStorage.removeItem("isLoggedIn")
                    router.replace("/login");
                }
            }
        }
    )
    // on render, fetch this user's projects
    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + "/project/by-user";
        const getData = async() => {
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
            <h2 className="text-2xl text-gray font-semibold mb-4" id="dashboard-heading">Dashboard</h2>
            {projects === undefined ? (
                <div className="flex justify-center items-center">
                    <Spinner/>
                </div>
            ) : (
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
                                    <span className="text-left">{project.title}</span>
                                    <button onClick={() => handleSeeMore(project.id)} className="text-blue-500 hover:underline text-right" aria-label={`See more details about ${project.title}`}>See More</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProjectDashboard;