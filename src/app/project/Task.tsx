"use client"
import React, { useState } from 'react';
import { Draggable } from "@hello-pangea/dnd";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as Dialog from "@radix-ui/react-dialog";
import Cross from '../components/Cross';
import { toast } from 'sonner';
import { MoreHoriz } from '@mui/icons-material';
import Select from "react-select";
import { useTasks } from "../context/TaskContext";

interface TaskProps {
    task: {
        id: number;
        pid: number;
        description: string;
        priority: number;
        status: number; // 1->Todo, 2: In Progress, 3: Complete
    };
    index: number;
    pid: string;
}

const Task: React.FC<TaskProps> = ({ task, index, pid }) => {
    const [content, setContent] = useState(task.description);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    
    // Get functions from context
    const { updateTaskContent, deleteTask, updateTaskStatus } = useTasks();
    
    const taskStatus: any = {1: "Todo", 2: "In Progress", 3: "Completed"};
    const statusToNumber: any = {"Todo": 1, "In Progress": 2, "Completed": 3};
    
    const options: any = [
        { value: "Todo", label: "Todo"},
        { value: "In Progress", label: "In Progress"},
        { value: "Completed", label: "Completed"},
    ]
    
    const handleChange = (choice: any) => {
        setSelectedStatus(choice);
    };
    
    const customStyles = {
        option: (styles: any, { isSelected }: any) => ({
            ...styles,
            backgroundColor: isSelected ? '#171d22' : 'text-slate-200',
            color: isSelected ? 'white' : '#171d22',
            '&:hover': {
                backgroundColor: '#171d22',
                color: 'white'
            }
        }),
        multiValue: (styles: any) => ({
            ...styles,
            backgroundColor: '#171d22',
        }),
        multiValueLabel: (styles: any) => ({
            ...styles,
            color: 'white',
        })
    };

    const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            const promises = [];
            
            // Update content if changed
            if (content !== task.description) {
                promises.push(updateTaskContent(task.id, content));
            }
            
            // Update status if changed
            if (selectedStatus && statusToNumber[selectedStatus.value] !== task.status) {
                promises.push(updateTaskStatus(task.id, statusToNumber[selectedStatus.value], pid));
            }
            
            if (promises.length > 0) {
                await Promise.all(promises);
                toast.success("Task updated successfully");
            } else {
                toast.info("No changes to save");
            }
        } catch (error) {
            console.error("Failed to update task:", error);
            toast.error("Failed to update task");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask(task.id, pid);
            // Don't show success toast, context already does it
        } catch (error) {
            // Error notification handled in context
        }
    };

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
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
                                    Edit the task&#39;s content or status, or delete the task. If you don&#39;t wish to make changes, close out of this popup by pressing cancel.
                                </Dialog.Description>
                                <fieldset className="flex gap-4 items-center mb-2">
                                    <label className="text-md bg-primary-400 w-1/3 text-left text-slate-300" htmlFor="status">
                                        Task Status:
                                    </label>
                                    <Select 
                                        className="my-react-select-container"
                                        classNamePrefix="my-react-select"
                                        closeMenuOnSelect={true} 
                                        defaultValue={{label: taskStatus[task.status], value: taskStatus[task.status]}} 
                                        options={options} 
                                        styles={customStyles}
                                        onChange={handleChange}
                                        placeholder="Select status..."
                                    />
                                </fieldset>
                                <fieldset className="flex gap-4 items-center mb-2">
                                    <label className="text-md bg-primary-400 w-1/3 text-left text-slate-300" htmlFor="description">
                                        Description:
                                    </label>
                                    <input 
                                        className="w-full flex inline-flex items-center justify-center border border-primary-200 rounded-md pl-3 text-md bg-primary-300 h-8" 
                                        id="description" 
                                        value={content}
                                        onChange={handleChangeContent} 
                                    />
                                </fieldset>
                                <div className="flex w-full justify-between">
                                    <div className="items-start mt-5">
                                        <button 
                                            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-slate-100 rounded-lg transition duration-300"
                                            onClick={handleDelete}
                                        >
                                            Delete Task
                                        </button>
                                    </div>
                                    <div className="items-end mt-5">
                                        <Dialog.Close asChild>
                                            <button className="py-2 px-4 mr-2 bg-primary-100 hover:bg-secondary-200 text-slate-100 rounded-lg transition duration-300 border border-slate-500">Cancel</button>
                                        </Dialog.Close>
                                        <Dialog.Close asChild>
                                            <button 
                                                className="py-2 px-4 bg-secondary-100 hover:bg-secondary-200 text-slate-100 rounded-lg transition duration-300"
                                                onClick={handleSubmit}
                                            >
                                                Confirm
                                            </button>
                                        </Dialog.Close>
                                    </div>
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