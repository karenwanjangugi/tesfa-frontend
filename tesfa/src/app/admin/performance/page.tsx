"use client";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../sharedcomponent/Sidebar";
import ApiUsageChart from "./components/ApiUsageChart";
import { useQueryLog } from "@/app/hooks/useQueryLog";
import CalendarPicker from "../sharedcomponent/Calender";
type LogType = { query: string; created_at?: string };
type DateRange = [Date | null, Date | null];
function aggregateQueriesByMonth(logs: LogType[]): { month: string; value: number }[] {
  const counts: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.created_at) {
      const d = new Date(log.created_at);
      const month = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      counts[month] = (counts[month] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));
}
function filterLogsByDateRange(logs: LogType[], dateRange: DateRange) {
  const [start, end] = dateRange;
  if (!start || !end) return logs;
  return logs.filter((log) => {
    if (!log.created_at) return false;
    const logDate = new Date(log.created_at);
    return logDate >= start && logDate <= end;
  });
}
export default function PerformancePage() {
  const { logs = [], loading, error } = useQueryLog();
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const filteredLogs: LogType[] = filterLogsByDateRange(
    (logs as any[]) || [],
    dateRange
  ).filter((log): log is LogType => typeof log.query === "string");
  const queryData = aggregateQueriesByMonth(filteredLogs);
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar />
  
      <div className="flex-1 flex flex-col overflow-hidden">
     
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className=" mx-auto space-y-8">
            <div className="mb-6">
              <CalendarPicker onDateChange={setDateRange} />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
              <h1 className="text-2xl font-semibold text-teal-900">
                Tesfa Agent
              </h1>
            </div>
           
            <div className="space-y-6 ">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <p className="w-24 font-medium text-[#B6890D] shrink-0">
                  Accuracy
                </p>
                <div className="flex-1 h-7 bg-gray-300 rounded-full overflow-hidden w-full">
                  <div className="h-full w-[70%] bg-[#082D32]"></div>
                </div>
                <p className="w-12 font-semibold text-[#B6890D] text-center">
                  70%
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <p className="w-24 font-medium text-[#B6890D] shrink-0">
                  Efficiency
                </p>
                <div className="flex-1 h-7 bg-gray-300 rounded-full overflow-hidden w-full">
                  <div className="h-full w-[60%] bg-[#082D32]"></div>
                </div>
                <p className="w-12 font-semibold text-[#B6890D] text-center">
                  60%
                </p>
              </div>
            </div>
          
            <div className="bg-blue-100 rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Number of Queries
                </h2>
                <button className="px-5 py-2 border border-gray-400 rounded-full text-sm bg-white hover:bg-gray-100">
                  Monthly View
                </button>
              </div>
              {loading ? (
                <div className="text-center py-10">Loading chart...</div>
              ) : error ? (
                <div className="text-red-600 text-center py-10">{error}</div>
              ) : (
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={queryData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#134E4A"
                        fill="#134E4A"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div>
              <ApiUsageChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}