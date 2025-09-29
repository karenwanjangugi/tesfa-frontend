
"use client";

import useFetchApiUsageStats from "@/app/hooks/usefetchApiusage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function ApiUsageChart() {
const { data, loading, error } = useFetchApiUsageStats();




  const endpoints = [
    { key: "queries", name: "Queries", color: "#0f2e2e" },
    { key: "users", name: "Users", color: "#3b82f6" },
    { key: "tasks", name: "Tasks", color: "#10b981" },
    { key: "agents", name: "Agents", color: "#8b5cf6" },
    { key: "predictions", name: "Predictions", color: "#d97706" },
    { key: "countries", name: "Countries", color: "#ef4444" },
  ];

  return (
    <div className="flex h-screen">
     
      <div className="flex-1 bg-cyan-100 py-10 px-1">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold">API Usage Overview</h1>
          <span className="text-gray-500">Last 9 months</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly API Calls by Endpoint</h2>
          <ResponsiveContainer width="100%" height={250}>
            
             <LineChart data={data}>
              
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {endpoints.map((endpoint) => (
                <Line
                  key={endpoint.key}
                  type="monotone"
                  dataKey={endpoint.key}
                  name={endpoint.name}
                  stroke={endpoint.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}