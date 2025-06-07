"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Lane from "./Lane";
import { useTasks } from "../context/TaskContext"; // Import the hook

interface ProjectViewProps {
  project: any;
  pid: string;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, pid }) => {
  const router = useRouter();
  // Get state and functions directly from the context!
  const { tasks, setTasks, updateTaskStatus } = useTasks();

  const goBack = () => router.back();

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // Your optimistic update logic here is excellent.
    const newTasks = { ...tasks };
    const sourceColumn = [...newTasks[source.droppableId as keyof typeof tasks]];
    const [removed] = sourceColumn.splice(source.index, 1);
    // If moving within the same column
    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, removed);
      newTasks[source.droppableId as keyof typeof tasks] = sourceColumn;
    } else {
      // Moving to a different column
      const destColumn = [
        ...newTasks[destination.droppableId as keyof typeof tasks],
      ];
      destColumn.splice(destination.index, 0, removed);
      newTasks[source.droppableId as keyof typeof tasks] = sourceColumn;
      newTasks[destination.droppableId as keyof typeof tasks] = destColumn;
    }
    setTasks(newTasks); // Update local state immediately

    // Update server in the background via the context function
    const newStatus =
      ["Todo", "In Progress", "Completed"].indexOf(destination.droppableId) + 1;
    updateTaskStatus(removed.id, newStatus);
  };

  // All other functions (addTask, deleteTask, etc.) are GONE from this component.
  // They live in the context now.

  return (
    <div className="h-screen flex">
      {/* ... your JSX for project info ... */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="animate-slideUp flex flex-col md:flex-row flex-wrap h-fit justify-between mx-5">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <div
              key={columnId}
              className="w-full lg:w-[calc(33.333%-1rem)] flex-grow h-96 md:mx-2 my-3"
            >
              {/* Lane no longer needs all those function props! */}
              <Lane title={columnId} pid={pid} />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
