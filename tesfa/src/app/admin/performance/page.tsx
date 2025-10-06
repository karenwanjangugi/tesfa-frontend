"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
      const month = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      counts[month] = (counts[month] || 0) + 1;
    }
  });
  
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));
}

function filterLogsByDateRange(
  logs: LogType[],
  dateRange: DateRange
) {
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


  const filteredLogs: LogType[] = filterLogsByDateRange((logs as any[]) || [], dateRange)
    .filter((log): log is LogType => typeof log.query === "string");

  const queryData = aggregateQueriesByMonth(filteredLogs);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1  p-6">
                  <CalendarPicker onDateChange={setDateRange} />
        <div className="flex  justify-between items-center mb-5 relative">
          <h1 className="text-2xl font-semibold flex items-center text-teal-900 gap-2">
            Tesfa Agent
          </h1>
          
        </div>

        <div className="space-y-8 mb-7">
          <div className="flex items-center gap-2">
            <p className="w-24 font-medium text-[#b6890d]">Accuracy</p>
            <div className="flex-1 h-7  bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r bg-[#082D32]"></div>
            </div>
            <p className="w-12 font-semibold text-[#b6890d]">70%</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="w-24 font-medium text-[#b6890d]">Efficiency</p>
            <div className="flex-1 h-7  bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r bg-[#082D32]"></div>
            </div>
            <p className="w-12 font-semibold text-[#b6890d]">60%</p>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold"></h2>
            <button className="px-5 py-2 border cursor-pointer border-gray-400 rounded-full text-sm">
              Number of Queries
            </button>
          </div>
          {loading ? (
            <div className="text-center py-10">Loading chart...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-10">{error}</div>
          ) : (
  <ResponsiveContainer width="100%" height={250}>
  <AreaChart data={queryData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="value" 
      stroke="#134e4a"   
      fill="#134e4a"    
    />
  </AreaChart>
</ResponsiveContainer>
          )}
        </div>
        <ApiUsageChart />
      </div>
    </div>
  );
}