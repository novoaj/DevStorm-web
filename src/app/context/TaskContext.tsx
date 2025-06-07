"use client";
import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../axiosInstance";

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
  setTasks: React.Dispatch<React.SetStateAction<TaskLanes>>; // Expose setTasks for dnd
  addTask: (
    projectId: string,
    description: string,
    status: number,
  ) => Promise<void>;
  updateTaskStatus: (taskId: number, newStatus: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  updateTaskContent: (
    taskId: number,
    newDescription: string,
  ) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Define the props for the provider
interface TaskProviderProps {
  children: React.ReactNode;
  initialTasks: TaskLanes;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
  initialTasks,
}) => {
  // 1. Initialize state with data from the server
  const [tasks, setTasks] = useState<TaskLanes>(initialTasks);

  // 3. All functions now use the simplified proxy URL via axiosInstance
  const addTask = async (
    projectId: string,
    description: string,
    status: number,
  ) => {
    try {
      // The URL is now just the path, e.g., '/task/123/create'
      const response = await axiosInstance.post(`/task/${projectId}/create`, {
        description,
        priority: 1,
        status,
      });
      const newTask: Task = response.data.task;
      const lane =
        status === 1 ? "Todo" : status === 2 ? "In Progress" : "Completed";
      setTasks((prevTasks) => ({
        ...prevTasks,
        [lane]: [...prevTasks[lane], newTask].sort(
          (a, b) => a.priority - b.priority,
        ),
      }));
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: number) => {
    try {
      // Optimistic update happens in the component, this is the API call
      await axiosInstance.put(`/task/${taskId}/update-status`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating task status", err);
      // Here you could add logic to revert the optimistic update on failure
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      // Optimistic update: remove from state first
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
          updatedTasks[lane] = updatedTasks[lane].filter(
            (task) => task.id !== taskId,
          );
        }
        return updatedTasks;
      });
      // Then call the API
      await axiosInstance.delete(`/task/${taskId}/delete`);
    } catch (err) {
      console.error("Error deleting task", err);
      // Revert state on error if needed
    }
  };

  const updateTaskContent = async (
    taskId: number,
    newDescription: string,
  ) => {
    try {
      // Optimistic update
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
          updatedTasks[lane] = updatedTasks[lane].map((task) =>
            task.id === taskId ? { ...task, description: newDescription } : task,
          );
        }
        return updatedTasks;
      });
      // API call
      await axiosInstance.put(`/task/${taskId}/update-description`, {
        description: newDescription,
      });
    } catch (err) {
      console.error("Error updating task content", err);
      throw err; // Re-throw to be caught in the component for toast notifications
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        updateTaskContent,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// The hook remains the same
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};