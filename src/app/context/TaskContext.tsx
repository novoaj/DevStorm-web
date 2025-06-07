"use client";
import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../axiosInstance";
import { invalidateTasks } from "../actions/cache-actions";
import { notifications } from "../../utils/notifications";

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
  setTasks: React.Dispatch<React.SetStateAction<TaskLanes>>;
  addTask: (projectId: string, description: string, status: number) => Promise<void>;
  updateTaskStatus: (taskId: number, newStatus: number, pid: string) => Promise<void>;
  deleteTask: (taskId: number, pid: string) => Promise<void>;
  updateTaskContent: (taskId: number, newDescription: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
  initialTasks: TaskLanes;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
  initialTasks,
}) => {
  const [tasks, setTasks] = useState<TaskLanes>(initialTasks);

  const addTask = async (projectId: string, description: string, status: number) => {
    try {
      const response = await axiosInstance.post(`/task/${projectId}/create`, {
        description,
        priority: 1,
        status,
      });
      
      const newTask: Task = response.data.task;
      const lane = status === 1 ? "Todo" : status === 2 ? "In Progress" : "Completed";
      
      setTasks((prevTasks) => ({
        ...prevTasks,
        [lane]: [...prevTasks[lane], newTask].sort((a, b) => a.priority - b.priority),
      }));

      await invalidateTasks(projectId);
      notifications.success.taskAdded();
    } catch (err) {
      console.error("Error adding task", err);
      notifications.error.taskAddFailed();
      throw err;
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: number, pid: string) => {
    const originalTasks = tasks;
    
    try {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        let taskToMove: Task | null = null;
        
        // remove task from current lane
        for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
          const taskIndex = updatedTasks[lane].findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = { ...updatedTasks[lane][taskIndex], status: newStatus };
            updatedTasks[lane] = updatedTasks[lane].filter(task => task.id !== taskId);
            break;
          }
        }
        
        // Add task to new lane
        if (taskToMove) {
          const newLane = newStatus === 1 ? "Todo" : newStatus === 2 ? "In Progress" : "Completed";
          updatedTasks[newLane] = [...updatedTasks[newLane], taskToMove]
            .sort((a, b) => a.priority - b.priority);
        }
        
        return updatedTasks;
      });

      await axiosInstance.put(`/task/${taskId}/update-status`, {
        status: newStatus,
      });
      
      await invalidateTasks(pid);
    } catch (err) {
      // Revert on failure
      setTasks(originalTasks);
      console.error("Error updating task status", err);
      notifications.error.taskUpdateFailed();
      throw err;
    }
  };

  const deleteTask = async (taskId: number, pid: string) => {
    const originalTasks = tasks;
    
    try {
      // Optimistic update
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const lane of Object.keys(updatedTasks) as (keyof TaskLanes)[]) {
          updatedTasks[lane] = updatedTasks[lane].filter(
            (task) => task.id !== taskId,
          );
        }
        return updatedTasks;
      });

      await axiosInstance.delete(`/task/${taskId}/delete`);
      await invalidateTasks(pid);
      notifications.success.taskDeleted();
    } catch (err) {
      // Revert on failure
      setTasks(originalTasks);
      console.error("Error deleting task", err);
      notifications.error.taskDeleteFailed();
      throw err;
    }
  };

  const updateTaskContent = async (taskId: number, newDescription: string) => {
    const originalTasks = tasks;
    
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

      await axiosInstance.put(`/task/${taskId}/update-description`, {
        description: newDescription,
      });
      notifications.success.taskUpdated();
    } catch (err) {
      // Revert on failure
      setTasks(originalTasks);
      console.error("Error updating task content", err);
      notifications.error.taskUpdateFailed();
      throw err;
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

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};