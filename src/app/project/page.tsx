"use client";
import React, {useState, useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Lane from './Lane';
import axios from 'axios';
import { fetchCSRFToken } from '../actions/actions';
import Spinner from '../components/Spinner';

interface Task {
    id: number;
    priority: number;
    content: string;
    status: number;
}

interface ProjectTasks {
    [key: string]: Task[];
}
interface Project {
  id: string;
  languages: string[];
  title: string;
  steps: string[];
  summary: string;
  username: string;
}
const Project: React.FC = () => {
    // TODO: fetch project details on component render (project info and tasks)
    const searchParams = useSearchParams();
    const pid = searchParams.get('pid');
    const router = useRouter();
    const [project, setProject] = useState<Project>();
    const [projectData, setProjectData] = useState<ProjectTasks>({
        Todo: [
          { id: 1, priority: 3, content: 'Create React frontend', status: 1 },
          { id: 2, priority: 2, content: 'Connect your API to your database', status: 1},
          { id: 3, priority: 1, content: 'Create Flask/Django backend', status: 1},
          { id: 8, priority: 3, content: 'Use axios or fetch api to interface with API/backend', status: 1},
          { id: 9, priority: 2, content: 'create CRUD endpoints for database interactions', status: 1},
          { id: 10, priority: 1, content: 'Host database locally or in the cloud (AWS RDS, Azure, etc)', status: 1 },
          { id: 11, priority: 1, content: 'Set up users table and schema with necessary fields (userid, email, password, date_joined)', status: 1},
        ],
        inProgress: [
          { id: 4, priority: 2, content: 'Delete-user endpoint in API', status: 2},
          { id: 5, priority: 1, content: 'Set up tasks table and schema with id, userid, content fields', status: 2 },
        ],
        Completed: [
          { id: 6, priority: 2, content: 'Create-user endpoint in API for inserting new user into database', status: 3},
          { id: 7, priority: 1, content: 'Select Database Engine (MySQL, PostgreSQL, etc)', status: 3},
        ],
      });

    const goBack = () => {
        router.back();        
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
    
        if (!destination) {
          return;
        }
    
        if (
          source.droppableId === destination.droppableId &&
          source.index === destination.index
        ) {
          return;
        }
    
        const sourceColumn = projectData[source.droppableId];
        const destColumn = projectData[destination.droppableId];
        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);
    
        setProjectData({
          ...projectData,
          [source.droppableId]: sourceColumn,
          [destination.droppableId]: destColumn,
        });
      };

    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
        }
    });
    axiosInstance.interceptors.request.use(async request => {
        // console.log(request);
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
                    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/token/refresh", {}, {
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
    useEffect(() => {
        let url = process.env.NEXT_PUBLIC_API_URL + `/project/${pid}`;
        const getData = async() => {
            const response = await axiosInstance.get(url, {
                withCredentials: true
            });
            console.log(response.data);
            setProject(response.data);
        }   
        getData(); 
    }, [pid])

    // TODO: loading icon for screens that wait on server data
    return ( 
        <div className="h-screen flex">
            <div className="p-4 flex flex-col flex-1">
                <div className="mx-8">
                    <button
                        className="bg-secondary-100 hover:bg-secondary-200 text-gray px-4 py-2 rounded mb-4 transition duration-300"
                        onClick={goBack}
                    >
                        &lt; Back
                    </button>
                    {project === undefined ? (
                      <div className="flex justify-center items-center">
                        <Spinner/>
                      </div>
                    ) : (
                      <div className="bg-primary-300 border rounded-lg border-primary-200 p-5 space-y-4 sm:space-y-0 sm:space-x-4">
                        <h1 className="text-2xl font-bold mb-4 ml-3 text-gray">{project.title}</h1>
                        <p className="text-gray">{project.summary}</p>
                        <br/>
                        <p className="text-gray">This drag and drop interface allows you to keep track of your progress while completing your project. Tasks are sorted by priority with the most critical tasks being at the top.</p>
                      </div>
                    )}

                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="animate-slideUp flex flex-col md:flex-row flex-wrap h-fit w-full justify-between p-5 space-y-4 sm:space-y-0 sm:space-x-4">
                        {Object.entries(projectData).map(([columnId, tasks]) => (
                            <div key={columnId} className="w-full md:w-[calc(33.333%-1rem)] flex-grow ">
                                <Lane 
                                    title={columnId} 
                                    tasks={tasks.sort((a, b) => a.priority - b.priority)} 
                                />
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Project;