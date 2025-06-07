"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Lane from "./Lane";
import { useTasks } from "../context/TaskContext"; // Import the hook
import { toast } from "sonner";

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

    const originalTasks = { ...tasks }; // save original

    const newTasks = { ...tasks }; 
    const sourceColumn = [...newTasks[source.droppableId as keyof typeof tasks]];
    const [removed] = sourceColumn.splice(source.index, 1);
    // same column
    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, removed);
      newTasks[source.droppableId as keyof typeof tasks] = sourceColumn;
    } else {
      // different column
      const destColumn = [
        ...newTasks[destination.droppableId as keyof typeof tasks],
      ];
      destColumn.splice(destination.index, 0, removed);
      newTasks[source.droppableId as keyof typeof tasks] = sourceColumn;
      newTasks[destination.droppableId as keyof typeof tasks] = destColumn;
    }
    setTasks(newTasks); // optimistic update

    // Update server in the background via the context function
    try{
      const newStatus = ["Todo", "In Progress", "Completed"].indexOf(destination.droppableId) + 1;
      updateTaskStatus(removed.id, newStatus, pid); // TODO if this update fails, revert update to ui
    }catch (error) {
      console.error("Failed to update task status: ", error)
      setTasks(originalTasks);
      toast.error("Failed to move task. Changes have been reverted.", { duration: 3000 });
    }
  };
  
  return (
    <div className="h-screen flex">
            <div className="p-4 flex flex-col flex-1">
                <div className="mx-8">
                    <button
                        className="bg-secondary-100 hover:bg-secondary-200 text-gray px-4 py-2 rounded-full mb-4 transition duration-300 ml-8"
                        onClick={goBack}
                    >
                       Back
                    </button>
                    
                    {/* Project info - server rendered, no loading needed */}
                    <div className="bg-primary-300 border rounded-lg border-primary-200 p-5 space-y-4 sm:space-y-0 sm:space-x-4 mx-8">
                        <h1 className="text-2xl font-bold mb-4 ml-3 text-slate-200">{project.title}</h1>
                        <p className="text-slate-300">{project.summary}</p>
                    </div>
                </div>
                
                <div className="flex flex-col mt-8 bg-primary-300 mx-8">
                    <p className="text-slate-400 mx-8 p-3">
                        This drag and drop interface allows you to keep track of your progress while completing your project.
                    </p>
                    
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="animate-slideUp flex flex-col md:flex-row flex-wrap h-fit justify-between mx-5">
                      {Object.entries(tasks).map(([columnId, columnTasks]) => (
                        <div
                          key={columnId}
                          className="w-full lg:w-[calc(33.333%-1rem)] flex-grow h-96 md:mx-2 my-3"
                        >
                          <Lane title={columnId} pid={pid} />
                        </div>
                      ))}
                    </div>
                  </DragDropContext>
                </div>
            </div>
        </div>
  );
};
