"use client";
import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useDashboardData } from "../../../hooks/useTaskPageData";
import Image from "next/image";
export default function TasksAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, error } = useDashboardData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 justify-center items-center">
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 justify-center items-center">
        <p className="text-red-600">
          Error loading data: {error.message}. Please ensure your token is valid.
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex h-screen bg-gray-50 justify-center items-center">
        <p className="text-gray-600">No data available.</p>
      </div>
    );
  }

  const { taskAssignments, predictions, taskTitleMap, organizationNameMap } = data;
  const totalInterventions = taskAssignments.length;
  const completedTasks = taskAssignments.filter(
    (assignment) => assignment.status === "completed"
  ).length;
  const predictedCases = predictions.length;
  const liveDashboardStats = [
    { title: "Predicted Cases", value: predictedCases },
    { title: "Total Interventions", value: totalInterventions },
    { title: "Completed Tasks", value: completedTasks },
  ];
 
  const filteredAssignments = taskAssignments.filter((assignment) => {
    const taskTitle = taskTitleMap.get(assignment.task)?.toLowerCase() || "";
    const orgName = organizationNameMap.get(assignment.organization)?.toLowerCase() || "";
    const status = assignment.status ? assignment.status.toLowerCase() : "";
    const query = searchQuery.toLowerCase();
    return taskTitle.includes(query) || orgName.includes(query) || status.includes(query);
  });
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
 
  const getStatusColor = (status?: string) => {
    if (!status) return "text-gray-600";
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "in_progress":
        return "text-orange-400";
      case "cancelled":
        return "text-purple-600";
      case "pending":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };
  const statusDisplayNames: Record<string, string> = {
    completed: "Completed",
    in_progress: "In Progress",
    cancelled: "Cancelled",
    pending: "Pending",
  };
  const getStatusDisplayName = (status?: string) =>
    statusDisplayNames[status ?? ""] || "Unknown";
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className=" mx-auto">
            <div className="flex flex-wrap justify-around gap-8 mb-12">
              {liveDashboardStats.map((stat, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center w-[160px] sm:w-[180px]"
                >
                  <Image
                    src="/Images/ellipse.png"
                    alt="Ellipse"
                    width={180}
                    height={180}
                    className="w-[160px] sm:w-[180px] h-auto object-contain"
                  />
                  <span className="absolute top-1/2 -translate-y-3/4 text-2xl sm:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </span>
                  <p className="mt-2 text-center text-base sm:text-lg font-medium text-black">
                    {stat.title}
                  </p>
                </div>
              ))}
            </div>
        
            <div className="mb-6 relative w-full max-w-md mx-auto">
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
       
            <div className="hidden md:grid grid-cols-[3.9fr_1.5fr_1fr_1fr] gap-4 mb-2 px-4 sm:px-10">
              <h3 className="font-semibold text-black text-lg">Tasks</h3>
              <h3 className="font-semibold text-black text-lg">Organization</h3>
              <h3 className="font-semibold text-black text-lg">Status</h3>
              <h3 className="font-semibold text-black text-lg">Date</h3>
            </div>
            <div className="h-1 bg-[#266A74] opacity-50 mb-8"></div>
       
            {filteredAssignments.length > 0 ? (
              <div className="space-y-3 mb-10 px-4 sm:px-10">
                {currentItems.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-3xl p-4 sm:p-5 drop-shadow-md border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[4fr_1.5fr_1fr_1fr] gap-3 md:gap-4 items-center">
                      <p className="text-gray-700 text-sm sm:text-base">
                        {taskTitleMap.get(assignment.task) ||
                          `Task ID: ${assignment.task}`}
                      </p>
                      <p className="text-gray-700 text-sm sm:text-base">
                        {organizationNameMap.get(assignment.organization) ||
                          `Org ID: ${assignment.organization}`}
                      </p>
                      <p className={`${getStatusColor(assignment.status)} text-sm sm:text-base`}>
                        {getStatusDisplayName(assignment.status)}
                      </p>
                      <p className="text-gray-700 text-sm sm:text-base">
                        {new Date(assignment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">No results found.</p>
              </div>
            )}
          
            {filteredAssignments.length > itemsPerPage && (
              <div className="flex justify-center items-center space-x-4 mt-4 pb-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg text-white bg-[#00353D] cursor-pointer px-4 py-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-black">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg cursor-pointer text-white bg-[#00353D] px-4 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





