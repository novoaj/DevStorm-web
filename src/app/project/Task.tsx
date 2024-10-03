import React from 'react';
import { Draggable } from "@hello-pangea/dnd";

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
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 p-2 border border-primary-200 rounded text-gray bg-primary-400"
                >
                    {task.description}
                </li>
            )}
        </Draggable>
    );
};

export default Task;