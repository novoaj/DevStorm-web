"use client"
import React, { createContext, useContext, useState } from 'react';
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

interface TaskContextType {
    tasks: TaskLanes;
    fetchTasks: (pid: string) => Promise<void>;
    addTask: (projectId: string, description: string, status: number) => Promise<void>;
    updateTaskStatus: (taskId: number, newStatus: number) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    updateTaskContent: (taskId: number, newDescription: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<TaskLanes>({
        "Todo": [],
        "In Progress": [],
        "Completed": []
    });

    const fetchTasks = async (pid: string) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${pid}`;
            const response = await axiosInstance.get(url, { withCredentials: true });
            const fetchedTasks: Task[] = response.data;

            const newTasks: TaskLanes = {
                "Todo": [],
                "In Progress": [],
                "Completed": []
            };

            fetchedTasks.forEach((task: Task) => {
                if (task.status === 1) newTasks["Todo"].push(task);
                else if (task.status === 2) newTasks["In Progress"].push(task);
                else if (task.status === 3) newTasks["Completed"].push(task);
            });

            Object.keys(newTasks).forEach(key => {
                newTasks[key as keyof TaskLanes].sort((a, b) => a.priority - b.priority);
            });

            setTasks(newTasks);
        } catch (err) {
            console.error("Error fetching tasks", err);
        }
    };
    const addTask = async (projectId: string, description: string, status: number) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${projectId}/create`;
            const response = await axiosInstance.post(url, 
                { description, priority: 1, status },
                { withCredentials: true }
            );
            const newTask: Task = response.data.task;
            const lane = status === 1 ? "Todo" : status === 2 ? "In Progress" : "Completed";
            setTasks(prevTasks => ({
                ...prevTasks,
                [lane]: [...prevTasks[lane], newTask].sort((a, b) => a.priority - b.priority)
            }));
        } catch (err) {
            console.error("Error adding task", err);
        }
    };

    const updateTaskStatus = async (taskId: number, newStatus: number) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/update-status`;
            await axiosInstance.put(url, { status: newStatus }, { withCredentials: true });

            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                let movedTask: Task | undefined;

                // Find and remove the task from its current lane
                for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
                    const taskIndex = updatedTasks[lane].findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        [movedTask] = updatedTasks[lane].splice(taskIndex, 1);
                        break;
                    }
                }

                // Add the task to its new lane
                if (movedTask) {
                    movedTask.status = newStatus;
                    const newLane = newStatus === 1 ? "Todo" : newStatus === 2 ? "In Progress" : "Completed";
                    updatedTasks[newLane].push(movedTask);
                    updatedTasks[newLane].sort((a, b) => a.priority - b.priority);
                }

                return updatedTasks;
            });
        } catch (err) {
            console.error("Error updating task status", err);
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/delete`;
            await axiosInstance.delete(url, { withCredentials: true });

            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
                    updatedTasks[lane] = updatedTasks[lane].filter(task => task.id !== taskId);
                }
                return updatedTasks;
            });
        } catch (err) {
            console.error("Error deleting task", err);
        }
    };

    const updateTaskContent = async (taskId: number, newDescription: string) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/update-description`;
            await axiosInstance.put(url, { description: newDescription }, { withCredentials: true });

            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
                    updatedTasks[lane] = updatedTasks[lane].map(task => 
                        task.id === taskId ? { ...task, description: newDescription } : task
                    );
                }
                return updatedTasks;
            });
        } catch (err) {
            console.error("Error updating task content", err);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, fetchTasks, addTask, updateTaskStatus, deleteTask, updateTaskContent }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};