"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { TaskCard } from '../Taskcard';
import { DropZone } from '../Dropzone';
import { useFetchTaskAssignments } from '../../../hooks/useFetchTaskAssignment';
import { Task } from '../../../utils/type';
import { TaskStatus } from '../../../utils/type';
import { deleteTaskAssignment } from '../../../utils/fetchtaskAssignment';


const columns = [
  { id: "pending", title: 'Tasks', color: 'bg-[#D3AC45]' },
  { id: "in_progress", title: 'Pending', color: 'bg-[#D3AC45]' },
  { id: 'cancelled', title: 'In progress', color: 'bg-[#D3AC45]' },
  { id: 'completed', title: 'Completed', color: 'bg-[#D3AC45]' },
];


export default function KanbanBoard() {
  const { assignedTasks, setAssignedTasks, loading, error, updateTaskStatus } = useFetchTaskAssignments();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const newTasksParam = searchParams.get('newTasks')
    if (newTasksParam) {
      try {
        const newTasks = JSON.parse(decodeURIComponent(newTasksParam))

    setAssignedTasks(prevTasks => {
      const existingTasksIds = new Set(prevTasks.map(t => t.id));
      const tasksToAdd = newTasks.filter((tasks:Task) => !existingTasksIds.has(tasks.id))
      return [...prevTasks, ...tasksToAdd]
    });

    router.replace('/kanban')

  } catch (e){
    console.error("failed to parse tasks from URL", e)
  }
}
}, [searchParams, setAssignedTasks, router])


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = assignedTasks.find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus

      setAssignedTasks((prevTasks: Task[]) =>{
        return prevTasks.map((task) => {
          if (task.id === taskId){
            return{...task, status: newStatus}
          }
          return task;
        })
      })
      updateTaskStatus(taskId, newStatus);
  }
  setActiveTask(null);
}

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = assignedTasks.find((task) => task.id === taskId);

    if(!taskToDelete || !taskToDelete.assignmentId){
      console.error("Cannot delete: Task or assignmentId not found.");
      return;
    }
    try{
      await deleteTaskAssignment(taskToDelete.assignmentId)
    
    setAssignedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  } catch{
    console.error("Failed to delete task assignment:", error)
  }
}

  const getTasksByStatus = (status: Task['status']) => {
    return assignedTasks.filter((task) => task.status === status)
  }

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600">Loading board...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-red-600">Something went Wrong, Please reload your page</p>
      </div>
    )
  }


  
  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-5 px-25 bg-gray-50 md:overflow-hidden relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Task Tracking</h1>
        </div>
        <div className="h-1.5 bg-[#266A74] opacity-50 mb-10"></div>
        <div className="grid grid-cols-4 gap-10 h-[80vh]">
          {columns.map((column) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#E7EDEE] rounded-lg shadow-sm overflow-hidden"
            >
              <div className={`${column.color} px-4 py-3 rounded-tl-[20px] rounded-tr-[20px]`}>
                <h3 className="font-large text-center text-black">{column.title}</h3>
              </div>
              <DropZone id={column.id} className="p-4 min-h-[40vh] lg:h-[80vh] md:h-[60vh] overflow-y-scroll no-scrollbar bg-gray-100 relative">
                <div className="space-y-3">
                  {getTasksByStatus(column.id as Task['status']).map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} onDelete={handleDeleteTask} />
                  ))}
                  {getTasksByStatus(column.id as Task['status']).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </DropZone>
            </motion.div>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} index={0} onDelete={handleDeleteTask}/> : null}
      </DragOverlay>
    </DndContext>
  )
}

