import React from "react";
import { redirect } from "next/navigation";
import { ProjectView } from "./ProjectView";
import { TaskProvider } from "../context/TaskContext"; // Import the provider
import { getInitialProjectData, getInitialTasks } from "../actions/data-fetchers"; // Assume you moved fetch logic here

interface Task {
    id: number;
    pid: number;
    description: string;
    priority: number;
    status: number;
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

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: { pid?: string };
}) {
  const pid = searchParams.pid;
  if (!pid) redirect("/profile");

  // Fetch data in parallel on the server (This part was already great!)
  const [project, tasks] = await Promise.all([
    getInitialProjectData(pid),
    getInitialTasks(pid),
  ]);

  if (!project) redirect("/profile");

  const organizedTasks = organizeTasks(tasks);

  return (
    // 1. Wrap the client component in the provider
    // 2. Pass the server-fetched data as the initial state
    <TaskProvider initialTasks={organizedTasks}>
      <ProjectView project={project} pid={pid} />
    </TaskProvider>
  );
}