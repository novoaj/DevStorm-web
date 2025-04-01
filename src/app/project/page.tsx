"use client";
import React, {useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Lane from './Lane';
import axiosInstance from '../axiosInstance';
import Spinner from '../components/Spinner';
import { useTasks } from "../context/TaskContext";
import assert from 'assert';

interface Task {
    id: number;
    pid: number;
    description: string;
    priority: number;
    status: number; // 1->Todo, 2: In Progress, 3: Complete
}

interface TaskLanes {
  "Todo": Task[];
  "In Progress": Task[];
  "Completed": Task[];
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
    const { tasks, fetchTasks, updateTaskStatus } = useTasks();
    const rows = ["Todo", "In Progress", "Completed"]

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
    
        const sourceColumn = tasks[source.droppableId as keyof typeof tasks];
        const destColumn = tasks[destination.droppableId as keyof typeof tasks];

        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);
        const newStatus = ["Todo", "In Progress", "Completed"].indexOf(destination.droppableId) + 1;
        
        updateTaskStatus(removed.id, newStatus);
      };

    useEffect(() => {
        assert(pid);
        let url = process.env.NEXT_PUBLIC_API_URL + `/project/${pid}`;
        const getProjectData = async() => {
            try{
                const response = await axiosInstance.get(url, {
                  withCredentials: true
                });
                setProject(response.data);
            }catch (err) {
              // Error handling if project not found
                console.error("couldnt find project");
            }
        }   
        getProjectData(); 
        fetchTasks(pid);
    }, [pid])

    return ( 
        <div className="h-screen flex">
            <div className="p-4 flex flex-col flex-1">
                <div className="mx-8">
                    <button
                        className="bg-secondary-100 hover:bg-secondary-200 text-gray px-4 py-2 rounded-full mb-4 transition duration-300 ml-8"
                        onClick={goBack}
                    >
                       Back
                    </button>
                    {project === undefined ? (
                      <div className="flex justify-center items-center">
                        <Spinner/>
                      </div>
                    ) : (
                      <div className="bg-primary-300 border rounded-lg border-primary-200 p-5 space-y-4 sm:space-y-0 sm:space-x-4 mx-8">
                        <h1 className="text-2xl font-bold mb-4 ml-3 text-slate-200">{project.title}</h1>
                        <p className="text-slate-300">{project.summary}</p>
                        <br/>
                      </div>
                    )}
                </div>
                <div className="flex flex-col mt-8 bg-primary-300 mx-8">
                  <p className="text-slate-400 mx-8 p-3">This drag and drop interface allows you to keep track of your progress while completing your project. Tasks are sorted by priority with the most critical tasks being at the top.</p>
                  <DragDropContext onDragEnd={onDragEnd}>
                      <div className="animate-slideUp flex flex-col md:flex-row flex-wrap h-fit justify-between mx-5">
                          {project === undefined ? 
                            <></> : 
                            <>
                              {Object.entries(tasks).map(([columnId, tasks]) => (
                                <div key={columnId} className="w-full lg:w-[calc(33.333%-1rem)] flex-grow h-96 md:mx-2 my-3">
                                      <Lane 
                                        title={columnId} 
                                        project={pid || ""}
                                      />
                                </div>
                              ))}
                            </>}
                          
                      </div>
                  </DragDropContext>
                </div>
                
            </div>
        </div>
    );
};

export default Project;