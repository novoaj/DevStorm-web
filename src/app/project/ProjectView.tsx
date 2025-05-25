"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Lane from './Lane';
import axiosInstance from '../axiosInstance';

interface Task {
    id: number;
    pid: number;
    description: string;
    priority: number;
    status: number;
}

interface TaskLanes {
    "Todo": Task[];
    "In Progress": Task[];
    "Completed": Task[];
}

interface ProjectViewProps {
    project: any; // your project interface
    initialTasks: TaskLanes;
    pid: string;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ 
    project, 
    initialTasks, 
    pid 
}) => {
    const router = useRouter();
    const [tasks, setTasks] = useState<TaskLanes>(initialTasks);

    const goBack = () => {
        router.back();        
    }

    // Handle drag and drop
    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
    
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
        // Update local state immediately for smooth UX
        const newTasks = { ...tasks };
        const sourceColumn = [...newTasks[source.droppableId as keyof typeof tasks]];
        const destColumn = [...newTasks[destination.droppableId as keyof typeof tasks]];

        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);
        
        newTasks[source.droppableId as keyof typeof tasks] = sourceColumn;
        newTasks[destination.droppableId as keyof typeof tasks] = destColumn;
        
        setTasks(newTasks);

        // Update server in background
        const newStatus = ["Todo", "In Progress", "Completed"].indexOf(destination.droppableId) + 1;
        try {
            await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/task/${removed.id}/update-status`, {
                status: newStatus
            });
        } catch (error) {
            console.error('Failed to update task status:', error);
            // Optionally revert local state
        }
    };

    // Simple task management functions (no complex context needed)
    const addTask = async (description: string, status: number) => {
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/task/${pid}/create`, {
                description,
                priority: 1,
                status
            });
            
            const newTask = response.data.task;
            const lane = status === 1 ? "Todo" : status === 2 ? "In Progress" : "Completed";
            
            setTasks(prev => ({
                ...prev,
                [lane]: [...prev[lane], newTask].sort((a, b) => a.priority - b.priority)
            }));
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const updateTaskContent = async (taskId: number, newDescription: string) => {
        try {
            await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/update-description`, {
                description: newDescription
            });
            
            setTasks(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(lane => {
                    updated[lane as keyof TaskLanes] = updated[lane as keyof TaskLanes].map(task => 
                        task.id === taskId ? { ...task, description: newDescription } : task
                    );
                });
                return updated;
            });
        } catch (error) {
            throw error;
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            await axiosInstance.delete(`${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/delete`);
            
            setTasks(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(lane => {
                    updated[lane as keyof TaskLanes] = updated[lane as keyof TaskLanes].filter(task => task.id !== taskId);
                });
                return updated;
            });
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

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
                    
                    {/* Project info - server rendered, no loading needed */}
                    <div className="bg-primary-300 border rounded-lg border-primary-200 p-5 space-y-4 sm:space-y-0 sm:space-x-4 mx-8">
                        <h1 className="text-2xl font-bold mb-4 ml-3 text-slate-200">{project.title}</h1>
                        <p className="text-slate-300">{project.summary}</p>
                    </div>
                </div>
                
                <div className="flex flex-col mt-8 bg-primary-300 mx-8">
                    <p className="text-slate-400 mx-8 p-3">
                        This drag and drop interface allows you to keep track of your progress while completing your project.
                    </p>
                    
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="animate-slideUp flex flex-col md:flex-row flex-wrap h-fit justify-between mx-5">
                            {Object.entries(tasks).map(([columnId, columnTasks]) => (
                                <div key={columnId} className="w-full lg:w-[calc(33.333%-1rem)] flex-grow h-96 md:mx-2 my-3">
                                    <Lane 
                                        title={columnId} 
                                        pid={pid}
                                        tasks={columnTasks}
                                        onAddTask={addTask}
                                        onUpdateTask={updateTaskContent}
                                        onDeleteTask={deleteTask}
                                    />
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
};