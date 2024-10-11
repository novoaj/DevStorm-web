"use client"
import React, { useState } from 'react';
import { Droppable } from "@hello-pangea/dnd";
import Task from './Task';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import * as Dialog from "@radix-ui/react-dialog";
import Cross from '../components/Cross';
import { useTasks } from '../context/TaskContext';

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

interface LaneProps {
    title: string;
    project: string;
}

const Lane: React.FC<LaneProps> = ({ title, project }) => {
    const rows = ["Todo", "In Progress", "Completed"]
    const [taskDescription, setTaskDescription] = useState("");
    const { tasks, addTask } = useTasks();
    const laneTasks = tasks[title as keyof typeof tasks];


    const router = useRouter();

    const handleAddTask = async () => {
        const status = ["Todo", "In Progress", "Completed"].indexOf(title) + 1;
        await addTask(project, taskDescription, status);
        setTaskDescription("");
    }

    return (
        <div className="flex flex-col w-full p-5 h-full mx-2 bg-primary-300 border border-primary-200 rounded-md">
            <div className="flex flex-row justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray">{title}</h2>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <button className="bg-gray hover:bg-secondary-200 text-primary-100 hover:text-slate-100 rounded-md transition duration-300 h-fit w-fit px-1 flex items-center justify-center">
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
                                    <Dialog.Close asChild>
                                        <button className="h-5 w-5 inline-flex items-center justify-center absolute top-5 right-5 hover:border border-primary-200 rounded" aria-label="Close">
                                            <Cross />
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
                    <div className="flex-grow overflow-hidden hover:overflow-y-scroll pr-2">
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-full"
                        >
                            {laneTasks.map((task, index) => (
                                <Task key={index} task={task} index={index}/>
                            ))}
                            {provided.placeholder}
                        </ul>
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Lane;