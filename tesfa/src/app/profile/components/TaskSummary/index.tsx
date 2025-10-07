import React, { useState, useEffect } from 'react';
import { CheckCircle,  ChevronLeft, ChevronRight } from 'lucide-react';

import { useFetchTaskAssignments } from '@/app/hooks/useFetchTaskAssignment';

const TaskSummary = () => {
  const { assignedTasks, loading, error } = useFetchTaskAssignments();
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const completedTasks = Array.from(
    new Map(
      assignedTasks
        .filter(task => task.status === 'completed')
        .map(task => [task.id, task])
    ).values()
  );

  const totalTasks = assignedTasks.length;
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const totalPages = Math.max(1, Math.ceil(completedTasks.length / tasksPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [completedTasks.length, totalPages]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = completedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full h-full bg-[#F3FBFD] rounded-2xl shadow-[12px_12px_32px_rgba(0,0,0,0.15)] px-5 sm:px-7 py-8">
      <h2 className="text-2xl font-medium text-[#00353D] mb-6">Task Summary</h2>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-[#00353D]">{completedTasks.length}/{totalTasks} Tasks Completed</span>
          <span className="text-lg font-medium text-[#00353D]">{completedPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-[#8BB2B5] h-4 rounded-full" style={{ width: `${completedPercentage}%` }}></div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-medium text-[#00353D] mb-4">Recently Completed</h3>
        <ul className="space-y-4">
          {currentTasks.length === 0 ? (
            <li className="text-[#00353D]">No completed tasks yet.</li>
          ) : (
            currentTasks.map((task) => (
              <li key={task.id} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-[#00353D]">{task.title}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="mt-8 flex justify-center items-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#C3A041] hover:bg-[#B5913A] disabled:bg-gray-400"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <span className="text-lg font-medium text-[#00353D]">{currentPage} / {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#C3A041] hover:bg-[#B5913A] disabled:bg-gray-400"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskSummary;