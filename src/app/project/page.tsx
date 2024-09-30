"use client";
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Lane from './Lane';

const Project: React.FC = () => {
    const searchParams = useSearchParams();
    const pid = searchParams.get('pid');
    const router = useRouter();
    const projectData: { [key: string]: string[] } = {
        Todo: ['Task 1', 'Task 2', 'Task 3'],
        inProgress: ['Task 4', 'Task 5'],
        Completed: ['Task 6', 'Task 7']
    };

    const goBack = () => {
        router.back();        
    }

    return ( 
        <div className="h-screen flex flex-col">
            <div className="p-4 flex flex-col flex-1">
                <div className="flex-none ml-10">
                    <button 
                        className="bg-secondary-100 hover:bg-secondary-200 text-gray px-4 py-2 rounded mb-4 transition duration-300"
                        onClick={goBack}
                    >
                        Back
                    </button>
                    <h1 className="text-2xl font-bold mb-4 text-gray">Project ID: {pid}</h1>
                </div>
                <div className="animate-slideUp flex h-96 w-full justify-between p-5 overflow-y-auto">
                    {Object.keys(projectData).map((key) => (
                        <div key={key} className="min-w-[300px] p-2 md:w-1/3 w-full">
                            <Lane title={key} tasks={projectData[key]} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project;