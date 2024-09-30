import React from 'react';

interface LaneProps {
    title: string;
    tasks: string[];
}

const Lane: React.FC<LaneProps> = ({ title, tasks }) => {
    return (
        <div className="w-full p-5 h-full mx-2 bg-primary-300 border border-primary-200 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-gray">{title}</h2>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index} draggable className="mb-2 p-2 border rounded text-gray bg-primary-400">
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Lane;