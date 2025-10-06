"use client";
import { useState, useMemo } from "react";
import useFetchApiUsageStats, { ApiUsageStat } from "@/app/hooks/usefetchApiusage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


function getAvailableMonths(data: ApiUsageStat[], year: string) {
  return Array.from(
    new Set(
      data
        .filter(item => item.month && item.month.startsWith(year))
        .map(item => Number(item.month.split("-")[1]))
    )
  ).sort((a, b) => a - b);
}

export default function ApiUsageChart() {
  const { data, loading, error } = useFetchApiUsageStats();
  const safeData: ApiUsageStat[] = Array.isArray(data) ? data : [];

  const [yearInput, setYearInput] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");


  const availableMonths = useMemo(
    () => (yearInput.length === 4 ? getAvailableMonths(safeData, yearInput) : []),
    [safeData, yearInput]
  );


  const filteredData = useMemo(() => {
    if (yearInput.length === 4 && selectedMonth) {
      const monthStr = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
      return safeData.filter(item => item.month === `${yearInput}-${monthStr}`);
    } else if (yearInput.length === 4) {
      return safeData.filter(item => item.month && item.month.startsWith(yearInput));
    } else {
      return safeData;
    }
  }, [safeData, yearInput, selectedMonth]);

  function handleYearChange(e: React.ChangeEvent<HTMLInputElement>) {
    setYearInput(e.target.value);
    setSelectedMonth("");
  }

  const endpoints = [
    { key: "queries", name: "Queries", color: "#0f2e2e" },
    { key: "users", name: "Users", color: "#3b82f6" },
    { key: "tasks", name: "Tasks", color: "#10b981" },
    { key: "countries", name: "Countries", color: "#ef4444" },
  ];

  if (loading) return <div className="p-4">Loading API usage data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 py-10 px-1">
        <div className="flex justify-between items-center mb-5 relative">
          <h1 className="text-xl font-semibold">API Usage Overview</h1>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1900"
              max="2100"
              placeholder="Year"
              className="border border-[#FFC321] rounded px-3 py-1 w-24"
              value={yearInput}
              onChange={handleYearChange}
            />
            <select
              className="border border-[#FFC321] cursor-pointer rounded px-3 py-1"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              disabled={yearInput.length !== 4}
            >
              <option value="">All Months</option>
              {availableMonths.map(monthNum => (
                <option key={monthNum} value={monthNum}>
                  {MONTH_NAMES[monthNum - 1]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg text-[#b6890d] font-semibold mb-4">Monthly API Calls by Endpoint</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {endpoints.map(endpoint => (
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