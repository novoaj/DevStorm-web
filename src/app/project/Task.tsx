"use client"
import React from 'react';
import { Draggable } from "@hello-pangea/dnd";
import DehazeIcon from '@mui/icons-material/Dehaze';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

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
    return (
        <Draggable key={task.id} draggableId={task.description} index={index}>
            {(provided) => (
                <div className="flex flex-row justify-between mb-2 p-2 border border-primary-200 rounded text-gray bg-primary-400">
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        {task.description}
                    </li>
                    <ModeEditOutlineIcon fontSize={'small'}/>
                </div>
            )}
        </Draggable>
    );
};

export default Task;