// // app/(dashboard)/api-usage/page.tsx  (or wherever you keep pages)
"use client";

import Sidebar from "@/app/admin/sharedcomponent/Sidebar";
import { useState } from "react";

export default function ApiUsagePage() {
  const endpoints = [
    {
      name: "Users",
      url: "/api/users/",
      methods: ["GET", "POST"],
      description: "Manage user accounts",
    },
    {
      name: "Tasks",
      url: "/api/tasks/",
      methods: ["GET", "POST"],
      description: "Create and list tasks",
    },
    {
      name: "Task Assignments",
      url: "/api/task-assignments/",
      methods: ["GET", "POST"],
      description: "Assign tasks to agents",
    },
    {
      name: "Agents",
      url: "/api/agents/",
      methods: ["GET", "POST"],
      description: "AI and human agents",
    },
    {
      name: "Predictions",
      url: "/api/predictions/",
      methods: ["GET", "POST"],
      description: "Risk predictions",
    },
    {
      name: "Countries",
      url: "/api/countries/",
      methods: ["GET"],
      description: "High-risk countries list",
    },
    {
      name: "Regions",
      url: "/api/regions/",
      methods: ["GET"],
      description: "Affected regions",
    },
    {
      name: "Queries",
      url: "/api/queries/",
      methods: ["GET", "POST"],
      description: "User queries and logs",
    },
  ];

  const baseUrl = "https://tesfa-53b1c4b2cf65.herokuapp.com";

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">API Usage</h1>
        <p className="text-gray-600 mb-8">
          Below is a list of all available API endpoints. All requests require authentication with a valid token.
        </p>

        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-5 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {endpoint.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {endpoint.description}
                  </p>
                  <code className="block mt-2 text-sm bg-gray-100 p-2 rounded font-mono">
                    {baseUrl}{endpoint.url}
                  </code>
                </div>
                <div className="flex flex-wrap gap-2">
                  {endpoint.methods.map((method) => (
                    <span
                      key={method}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        method === "GET"
                          ? "bg-blue-100 text-blue-800"
                          : method === "POST"
                          ? "bg-green-100 text-green-800"
                          : method === "PUT" || method === "PATCH"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800">Authentication</h3>
          <p className="text-sm text-blue-700 mt-1">
            Include your token in the <code className="bg-blue-100 px-1 rounded">Authorization</code> header:
          </p>
          <code className="block mt-2 text-sm bg-gray-800 text-green-400 p-3 rounded font-mono">
            Authorization: Token YOUR_API_TOKEN
          </code>
        </div>
      </div>
    </div>
  );
}

// In s.tsx


// "use client";

// import useFetchApiUsageStats from "@/app/hooks/usefetchApiusage";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";


// export default function ApiUsageChart() {
//   // ✅ Mock data: API calls per endpoint per month
// const { data, loading, error } = useFetchApiUsageStats();




//   const endpoints = [
//     { key: "queries", name: "Queries", color: "#0f2e2e" },
//     { key: "users", name: "Users", color: "#3b82f6" },
//     { key: "tasks", name: "Tasks", color: "#10b981" },
//     { key: "agents", name: "Agents", color: "#8b5cf6" },
//     { key: "predictions", name: "Predictions", color: "#d97706" },
//     { key: "countries", name: "Countries", color: "#ef4444" },
//   ];

//   return (
//     <div className="flex h-screen">
     
//       <div className="flex-1 bg-white p-1">
//         <div className="flex justify-between items-center mb-2">
//           <h1 className="text-xl font-semibold">API Usage Overview</h1>
//           <span className="text-gray-500">Last 9 months</span>
//         </div>

//         {/* Multi-Series API Usage Chart */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h2 className="text-lg font-semibold mb-4">Monthly API Calls by Endpoint</h2>
//           <ResponsiveContainer width="100%" height={250}>
            
//              <LineChart data={data}>
              
//               <XAxis dataKey="week" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {endpoints.map((endpoint) => (
//                 <Line
//                   key={endpoint.key}
//                   type="monotone"
//                   dataKey={endpoint.key}
//                   name={endpoint.name}
//                   stroke={endpoint.color}
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                 />
//               ))}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }