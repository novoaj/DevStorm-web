import React from 'react';
import { Draggable } from "@hello-pangea/dnd";

interface TaskProps {
    task: {
        id: string;
        content: string;
    };
    index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
    return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 p-2 border border-primary-200 rounded text-gray bg-primary-400"
                >
                    {task.content}
                </li>
            )}
        </Draggable>
    );
};

export default Task;