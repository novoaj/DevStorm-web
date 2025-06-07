import React from "react";
import { redirect } from "next/navigation";
import { ProjectView } from "./ProjectView";
import { TaskProvider } from "../context/TaskContext";
import { getInitialProjectData, getInitialTasks } from "../actions/data-fetchers";

interface Task {
    id: number;
    pid: number;
    description: string;
    priority: number;
    status: number;
}

function organizeTasks(tasks: Task[]) {
    const organized = {
        "Todo": [] as Task[],
        "In Progress": [] as Task[],
        "Completed": [] as Task[]
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

interface PageProps {
  searchParams: Promise<{ pid?: string }>
}

export default async function ProjectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pid = params.pid;

  // validation for missing/invalid PID
  if (!pid || pid.trim() === '' || isNaN(Number(pid))) {
    console.log("Invalid or missing PID, redirecting to profile");
    redirect("/profile");
  }

  try {
    console.log(`Fetching data for project ${pid}...`);
    
    const [project, tasks] = await Promise.all([
      getInitialProjectData(pid),
      getInitialTasks(pid),
    ]);

    console.log("Project data received:", !!project);
    console.log("Tasks data received:", tasks?.length || 0);

    if (!project) {
      console.log("Project not found or access denied, redirecting to profile");
      redirect("/profile");
    }

    const organizedTasks = organizeTasks(tasks || []);

    return (
      <TaskProvider initialTasks={organizedTasks}>
        <ProjectView project={project} pid={pid} />
      </TaskProvider>
    );

  } catch (error) {
    console.error("Error fetching project data:", error);
    redirect("/profile");
  }
}