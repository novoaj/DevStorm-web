"use client";
import React, {useState} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Lane from './Lane';

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
    title : string;
    summary: string;
    steps: string;
    ideas: string;
}
const Project: React.FC = () => {
    // TODO: fetch project details on component render (project info and tasks)
    const searchParams = useSearchParams();
    const pid = searchParams.get('pid');
    const router = useRouter();
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

    return ( 
        <div className="h-screen flex">
            <div className="p-4 flex flex-col flex-1">
                <div className="ml-10">
                    <button
                        className="bg-secondary-100 hover:bg-secondary-200 text-gray px-4 py-2 rounded mb-4 transition duration-300"
                        onClick={goBack}
                    >
                        &lt; Back
                    </button>
                    <h1 className="text-2xl font-bold mb-4 text-gray">Project ID: {pid}</h1>
                    <p className="text-gray">Summary for this project. this project is axasdasd asdasd</p>
                    <br/>
                    <p className="text-gray">Additional features to build/scale up the project</p>
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