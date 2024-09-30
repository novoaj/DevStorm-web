import React from 'react';
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Task from './Task';

interface Task {
    id: string;
    content: string;
  }
  
  interface LaneProps {
    title: string;
    tasks: Task[];
  }

const Lane: React.FC<LaneProps> = ({ title, tasks }) => {
    return (
        <div className="flex flex-col w-full p-5 h-full mx-2 bg-primary-300 border border-primary-200 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-gray">{title}</h2>
            <Droppable droppableId={title}>
                {(provided) => (
                    <div className="flex-grow overflow-hidden hover:overflow-y-scroll pr-1">
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-full"
                        >
                            {tasks.map((task, index) => (
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