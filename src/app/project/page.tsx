"use client";
import React, {useState} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Lane from './Lane';

interface Task {
    id: string;
    priority: number;
    content: string;
    status: string;
}

interface ProjectData {
    [key: string]: Task[];
}
const Project: React.FC = () => {
    const searchParams = useSearchParams();
    const pid = searchParams.get('pid');
    const router = useRouter();
    const [projectData, setProjectData] = useState<ProjectData>({
        Todo: [
          { id: 'task1', priority: 3, content: 'Task 1', status: "Todo" },
          { id: 'task2', priority: 2, content: 'Task 2', status: "Todo"},
          { id: 'task3', priority: 1, content: 'Task 3', status: "Todo"},
          { id: 'task8', priority: 3, content: 'Task 8', status: "Todo"},
          { id: 'task9', priority: 2, content: 'Task 9', status: "Todo"},
          { id: 'task10', priority: 1, content: 'Task 10', status: "Todo" },
          { id: 'task11', priority: 1, content: 'Task 11', status: "Todo"},
        ],
        inProgress: [
          { id: 'task4', priority: 2, content: 'Task 4', status: "inProgress"},
          { id: 'task5', priority: 1, content: 'Task 5', status: "inProgress" },
        ],
        Completed: [
          { id: 'task6', priority: 2, content: 'Task 6', status: "Completed"},
          { id: 'task7', priority: 1, content: 'Task 7', status: "Completed"},
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
        <div className="h-screen flex flex-col">
            <div className="p-4 flex flex-col flex-1">
                <div className="flex-none ml-10">
                <button
                    className="bg-secondary-100 hover:bg-secondary-200 text-gray px-4 py-2 rounded mb-4 transition duration-300"
                    onClick={goBack}
                >
                    Back
                </button>
                <h1 className="text-2xl font-bold mb-4 text-gray">Project ID: {pid}</h1>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="animate-slideUp flex h-96 w-full justify-between p-5">
                        {Object.entries(projectData).map(([columnId, tasks]) => (
                        <Lane 
                            key={columnId} 
                            title={columnId} 
                            tasks={tasks.sort((a, b) => a.priority - b.priority)} 
                        />
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Project;