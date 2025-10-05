"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../sharedcomponent/Sidebar";
import ApiUsageChart from "./components/ApiUsageChart";
import { useQueryLog } from "@/app/hooks/useQueryLog";

type ChartData = {
  month: string;
  value: number;
};

function aggregateQueriesByMonth(logs: { query: string; created_at?: string }[]): ChartData[] {
  const monthCounts: Record<string, number> = {};
  const monthOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  logs.forEach((log) => {
    let dateStr = log.created_at;
    let month: string;
    if (dateStr) {
      const date = new Date(dateStr);
      month = monthOrder[date.getMonth()];
    } else {
      month = "Unknown";
    }
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  return monthOrder
    .filter((m) => monthCounts[m])
    .map((m) => ({
      month: m,
      value: monthCounts[m],
    }));
}

export default function PerformancePage() {
  const { logs, loading, error } = useQueryLog();


  const queryData = aggregateQueriesByMonth(logs as any[]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-white p-6">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold flex items-center text-teal-900 gap-2">
            Tesfa Agent
          </h1>
        </div>

        <div className="space-y-8 mb-7">
          <div className="flex items-center gap-2">
            <p className="w-24 font-medium text-yellow-600">Accuracy</p>
            <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r from-blue-800 to-teal-900"></div>
            </div>
            <p className="w-12 font-semibold text-yellow-600">70%</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="w-24 font-medium text-yellow-600">Efficiency</p>
            <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-gradient-to-r from-blue-800 to-teal-900"></div>
            </div>
            <p className="w-12 font-semibold text-yellow-600">60%</p>
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
                <Area type="monotone" dataKey="value" stroke="#08515C" fill="#0ffff" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <ApiUsageChart />
      </div>
    </div>
  );
}