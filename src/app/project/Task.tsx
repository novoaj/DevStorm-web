"use client"
import React, { useState } from 'react';
import { Draggable } from "@hello-pangea/dnd";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as Dialog from "@radix-ui/react-dialog";
import Cross from '../components/Cross';
import { toast } from 'sonner';
import { useTasks } from '../context/TaskContext';
import { MoreHoriz } from '@mui/icons-material';

interface TaskProps {
    task: {
        id: number;
        pid: number;
        description: string;
        priority: number;
        status: number; // 1->Todo, 2: In Progress, 3: Complete
    };
    index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
    const [content, setContent] = useState(task.description);
    const [isEdited, setIsEdited] = useState(false);
    const { updateTaskContent, deleteTask } = useTasks();

    const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
        setIsEdited(true);
    }

    const handleSubmit = async () => {
        try {
            await updateTaskContent(task.id, content);
            toast.success("Task updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred updating this task's content.");
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTask(task.id);
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Error deleting task");
        }
    }
    return (
        <Draggable key={task.id} draggableId={task.description} index={index}>
            {(provided) => (
                <div className="flex flex-row justify-between mb-2 p-2 border border-primary-200 rounded text-slate-300 hover:text-slate-100 bg-primary-400">
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        {task.description}
                    </li>
                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <MoreHoriz fontSize={'small'} className="cursor-pointer" /> 
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="bg-black opacity-75 fixed inset-0" />
                            <Dialog.Content className="p-6 fixed bg-primary-400 border border-primary-200 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-450 max-h-4/5 text-slate-100">
                                <Dialog.Title className="m-0 font-semibold text-xl text-slate-100">Edit Task</Dialog.Title>
                                <Dialog.Description className="mt-3 mb-6 text-md text-slate-300">
                                    Edit the task's content or delete the task. If you don't wish to make changes, close out of this popup by pressing cancel.
                                </Dialog.Description>
                                <fieldset className="flex gap-4 items-center mb-2">
                                    <label className="text-md bg-primary-400 w-48 text-left text-slate-300" htmlFor="description">
                                        Description:
                                    </label>
                                    <input 
                                        className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" 
                                        id="description" 
                                        value={content}
                                        onChange={handleChangeContent} />
                                </fieldset>
                                <div className="flex justify-center mt-5">
                                    <button 
                                        className="py-2 px-4 bg-red-500 hover:bg-red-600 text-slate-100 rounded-lg transition duration-300"
                                        onClick={handleDelete}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                                <div className="flex justify-end mt-5">
                                    <Dialog.Close asChild>
                                        <button className="py-2 px-4 mr-2 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-lg transition duration-300">Cancel</button>
                                    </Dialog.Close>
                                    <Dialog.Close asChild>
                                        <button 
                                            className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-slate-100 rounded-lg transition duration-300"
                                            onClick={handleSubmit}
                                            disabled={!isEdited}
                                        >
                                            Confirm
                                        </button>
                                    </Dialog.Close>
                                </div>
                                <Dialog.Close asChild>
                                    <button className="h-5 w-5 inline-flex items-center justify-center absolute top-5 right-5 hover:border border-primary-200 rounded" aria-label="Close">
                                        <Cross />
                                    </button>
                                </Dialog.Close>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>
            )}
        </Draggable>
    );
};

export default Task;