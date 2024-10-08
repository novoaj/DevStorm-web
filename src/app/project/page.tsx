"use client";
import React, {useState, useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Lane from './Lane';
import axios from 'axios';
import axiosInstance from '../axiosInstance';
import Spinner from '../components/Spinner';

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
    const [projectData, setProjectData] = useState<TaskLanes>({
      "Todo": [],
      "In Progress": [],
      "Completed": []
    });
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
    
        const sourceColumn = projectData[source.droppableId as keyof TaskLanes];
        const destColumn = projectData[destination.droppableId as keyof TaskLanes];
        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);
        
        const dstIdx = rows.indexOf(destination.droppableId) + 1;
        // update task status on backend
        const taskId = removed.id;
        const updateTaskStatus = async () => {
            try {
                let url = `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/update-status`
                await axiosInstance.put(url,
                    { 
                        status: dstIdx 
                    },
                    { 
                        withCredentials: true 
                    });
                // update columns locally
                setProjectData({
                  ...projectData,
                  [source.droppableId]: sourceColumn,
                  [destination.droppableId]: destColumn,
                });
            } catch (err) {
                console.error("Error updating task status", err);
            }
        };
        updateTaskStatus();
      };

    useEffect(() => {
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
        const getTasks = async() => {
          url = process.env.NEXT_PUBLIC_API_URL + `/task/${pid}`;
          try {
              const response = await axiosInstance.get(url, {
                withCredentials: true
              })
              let todo : Task[]= []
              let inp : Task[] = []
              let complete : Task[]= []
              response.data.forEach((task: Task) => {
                if (task.status === 1) {
                  todo.push(task);
                } else if (task.status === 2) {
                  inp.push(task);
                } else if (task.status === 3) {
                  complete.push(task);
                }
              });
              todo.sort((a, b) => a.priority - b.priority);
              inp.sort((a, b) => a.priority - b.priority);
              complete.sort((a, b) => a.priority - b.priority);
              setProjectData({
                "Todo": todo,
                "In Progress": inp,
                "Completed": complete
              });
          }catch (err) {
              console.error("error fetching tasks")
          }
        }
        getProjectData(); 
        getTasks();
    }, [pid])

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
                    <div className="animate-slideUp flex flex-col md:flex-row flex-wrap h-fit justify-between mx-8">
                        {projectData === undefined ? 
                          <></> : 
                          <>
                            {Object.entries(projectData).map(([columnId, tasks]) => (
                              <div key={columnId} className="w-full md:w-[calc(33.333%-1rem)] flex-grow h-96 md:mx-2 my-3">
                                    <Lane 
                                      title={columnId} 
                                      tasks={tasks.sort((a : Task, b : Task) => a.priority - b.priority)}
                                      project={pid || ""}
                                    />
                              </div>
                            ))}
                          </>}
                        
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Project;