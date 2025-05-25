import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ProjectView } from './ProjectView';
import { serverFetchWithRefresh } from '../actions/actions';

interface Task {
    id: number;
    pid: number;
    description: string;
    priority: number;
    status: number;
}

interface Project {
    id: string;
    languages: string[];
    title: string;
    steps: string[];
    summary: string;
    username: string;
}

// Server functions for parallel data fetching
async function getProjectData(pid: string) {
    try {
        const response = await serverFetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/project/${pid}`, 'GET');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch project data:', error);
        return null;
    }
}

async function getProjectTasks(pid: string) {
    try {
        const response = await serverFetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/task/${pid}`, 'GET');
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return [];
    }
}

// Organize tasks by status
function organizeTasks(tasks: Task[]) {
    const organized = {
        "Todo": [],
        "In Progress": [],
        "Completed": []
    };
    
    tasks.forEach(task => {
        switch(task.status) {
            case 1:
                organized["Todo"].push(task);
                break;
            case 2:
                organized["In Progress"].push(task);
                break;
            case 3:
                organized["Completed"].push(task);
                break;
        }
    });
    
    return organized;
}

// Server Component
export default async function ProjectPage({ 
    searchParams 
}: { 
    searchParams: { pid?: string } 
}) {
    const pid = searchParams.pid;
    
    if (!pid) {
        redirect('/profile');
    }

    // Check auth
    const cookieStore = cookies();
    const hasAuthCookies = cookieStore.has('csrf_access_token') || cookieStore.has('csrf_refresh_token');
    
    if (!hasAuthCookies) {
        redirect('/auth/login');
    }

    // Fetch data in parallel on the server
    const [projectResult, tasksResult] = await Promise.allSettled([
        getProjectData(pid),
        getProjectTasks(pid)
    ]);

    const project = projectResult.status === 'fulfilled' ? projectResult.value : null;
    const tasks = tasksResult.status === 'fulfilled' ? tasksResult.value : [];
    const organizedTasks = organizeTasks(tasks);

    // If project not found, redirect
    if (!project) {
        redirect('/profile');
    }

    return (
        <ProjectView 
            project={project}
            initialTasks={organizedTasks}
            pid={pid}
        />
    );
}