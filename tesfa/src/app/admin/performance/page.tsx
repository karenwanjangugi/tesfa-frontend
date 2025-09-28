"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../sharedcomponent/Sidebar";
import ApiUsagePage from "../../../../apiUsage/page";
import ApiUsageChart from "./ApiUsageChart";

export default function PerformancePage() {
  const queryData = [
    { month: "Feb", value: 500 },
    { month: "Mar", value: 200 },
    { month: "Apr", value: 400 },
    { month: "May", value: 300 },
    { month: "June", value: 450 },
    { month: "July", value: 280 },
    { month: "Aug", value: 470 },
    { month: "Sep", value: 320 },
    { month: "Oct", value: 350 },
  ];

  const apiUsageData = [
    { month: "Feb", calls: 1200 },
    { month: "Mar", calls: 950 },
    { month: "Apr", calls: 1400 },
    { month: "May", calls: 1100 },
    { month: "June", calls: 1600 },
    { month: "July", calls: 1050 },
    { month: "Aug", calls: 1750 },
    { month: "Sep", calls: 1300 },
    { month: "Oct", calls: 1420 },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-white p-6">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Tesfa Agent
          </h1>
          <span className="text-gray-500">date</span>
        </div>

        <div className="space-y-4 mb-1">
          <div className="flex items-center gap-2">
            <p className="w-24 font-medium">Accuracy</p>
            <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-gradient-to-r from-blue-700 to-teal-900"></div>
            </div>
            <p className="w-12 font-semibold">70%</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="w-24 font-medium">Efficiency</p>
            <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-gradient-to-r from-blue-700 to-teal-900"></div>
            </div>
            <p className="w-12 font-semibold">60%</p>
          </div>
        </div>

        {/* Number of Queries */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold"></h2>
            <button className="px-4 py-1 border border-gray-400 rounded-full text-sm">
              Number of Queries
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={queryData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#08515C" fill="#08515C" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
<ApiUsageChart/>
      </div>
    </div>
  );
}

