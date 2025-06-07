"use client";
import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import { useTasks } from "../context/TaskContext";
import AddIcon from '@mui/icons-material/Add';
import * as Dialog from "@radix-ui/react-dialog";
import { notifications } from "@/utils/notifications";

interface Task {
    id: number;
    pid: number;
    description: string;
    priority: number;
    status: number; // 1->Todo, 2: In Progress, 3: Complete
}

interface LaneProps {
  title: string;
  pid: string;
}

const Lane: React.FC<LaneProps> = ({ title, pid }) => {
  const [taskDescription, setTaskDescription] = useState("");
  // Get the function you need from the context
  const { addTask, tasks } = useTasks();

  const handleAddTask = async () => {
    const status = ["Todo", "In Progress", "Completed"].indexOf(title) + 1;
    try{
        await addTask(pid, taskDescription, status); // Use the context function
        setTaskDescription("");
    }catch(error){
        notifications.error.taskAddFailed();
    }

  };

  const taskList = tasks[title as keyof typeof tasks] || [];

  return (
    <div className="flex flex-col w-full p-3 h-full mx-2 bg-primary-300 border border-primary-200 rounded-md overflow-y-scroll">
            <div className="flex flex-row justify-between mb-2">
                <div className="flex flex-row text-center items-center">
                    <h2 className="text-xl font-semibold text-slate-200 w-fit pr-5">{title}</h2>
                    <p className="text-slate-400">{taskList.length}</p>
                </div>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <button className="bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-full transition duration-300 h-fit w-fit px-1 flex items-center justify-center">
                            <AddIcon fontSize={'medium'}/>  
                        </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <div className="flex justify-between items-center">
                            <Dialog.Overlay className="bg-black opacity-75 fixed inset-0" />
                            <Dialog.Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                                <Dialog.Title className="m-0 font-semibold text-xl">Add Task</Dialog.Title>
                                <Dialog.Description className="mt-3 mb-6 text-md">
                                    Create content for this new task.
                                </Dialog.Description>
                                
                                <fieldset className="flex gap-4 items-center mb-2">
                                    <label className="text-md bg-primary-400 w-48 text-left" htmlFor="content">
                                        Task Content
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8"
                                        placeholder="Task description"
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                    />
                                </fieldset>
                                <div className="flex justify-end mt-5">
                                    <Dialog.Close asChild>
                                        <button
                                            disabled={taskDescription === ""}
                                            className="bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-md transition duration-300 h-fit w-fit px-1"
                                            onClick={handleAddTask}
                                        >
                                            Submit
                                        </button>
                                    </Dialog.Close>
                                </div>
                            </Dialog.Content>
                        </div>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>       
            <Droppable droppableId={title}>
                {(provided) => (
                    <div className="flex-grow p-1">
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-full"
                        >
                            {taskList.map((task, index) => (
                                <Task 
                                    key={task.id} 
                                    task={task} 
                                    pid={pid}
                                    index={index}
                                />
                            ))}
                            {provided.placeholder}
                        </ul>
                    </div>
                )}
            </Droppable>
        </div>
    // ...
  );
};
export default Lane;
