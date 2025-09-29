"use client";
import useFetchOrganizations from "@/app/hooks/useFetchOrganizations";
import { useFetchPredictions } from "@/app/hooks/useFetchPredictionsAdmin";
import { useFetchTasks } from "@/app/hooks/useFetchTasksAdmin";
import { useState } from "react";
import { useFetchQueries } from "@/app/hooks/useQueries";
import { useAffectedCountries } from "@/app/hooks/useAffectedRegions";
import Sidebar from "../sharedcomponent/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CalendarPicker from "../sharedcomponent/Calender";
import { FaSpinner } from "react-icons/fa";


export default function DashboardPage() {
  const { predictions, loading: predictionsLoading } = useFetchPredictions();
const { tasks, loading: tasksLoading } = useFetchTasks();
const { queries: allQueries, loading: queriesLoading } = useFetchQueries();
  const { organizations: orgs, loading: orgsLoading } = useFetchOrganizations();
  const { data: countries, loading: countriesLoading } = useAffectedCountries();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const isDateInRange = (dateStr: string, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return true;
    const date = new Date(dateStr);
    const startOnly = new Date(start);
    startOnly.setHours(0, 0, 0, 0);
    const endOnly = new Date(end);
    endOnly.setHours(23, 59, 59, 999);
    return date >= startOnly && date <= endOnly;
  };

  const [startDate, endDate] = dateRange;

  const filteredQueries = allQueries?.filter(q =>
    isDateInRange(q.created_at, startDate, endDate)
  ) || [];

  const filteredOrgs = orgs?.filter(org => 
    isDateInRange(org.created_at, startDate, endDate)
  ) || [];

  const activeOrganizations = filteredOrgs.filter(
    (user: any) => user.role === 'organization' && user.is_active === true
  );



const getMonthLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
};


const orgsByMonth = activeOrganizations.reduce((acc: Record<string, number>, org: any) => {
  const monthLabel = getMonthLabel(org.created_at);
  acc[monthLabel] = (acc[monthLabel] || 0) + 1;
  return acc;
}, {});


  const countriesByYear = countries?.reduce((acc: Record<string, number>, country: any) => {
    const year = new Date().getFullYear().toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {}) || {};

  const countriesChartData = Object.entries(countriesByYear)
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year.localeCompare(b.year));

 // rename to avoid conflict

// ... rest of your code

// Compute counts (you can also filter by date if needed later)
const predictCount = predictions?.length || 0;
const taskCount = tasks?.length || 0;
const queryCount = allQueries?.length || 0;

const total = predictCount + taskCount + queryCount;

// Avoid division by zero
const pieData = total === 0 
  ? [
      { name: "Predict", value: 0, color: "#0f2e2e" },
      { name: "List of Tasks", value: 0, color: "#d7ad05" },
      { name: "Query", value: 0, color: "#1e3a8a" },
    ]
  : [
      { name: "Predict", value: predictCount, color: "#0f2e2e" },
      { name: "List of Tasks", value: taskCount, color: "#d7ad05" },
      { name: "Query", value: queryCount, color: "#1e3a8a" },
    ];

// Update loading state
const loading = orgsLoading || predictionsLoading || tasksLoading || queriesLoading || countriesLoading;
const generateMonthRange = (start: Date | null, end: Date | null): string[] => {
  const now = new Date();
  

  
  const defaultStart = new Date();
  defaultStart.setMonth(now.getMonth() - 5); 
  const defaultEnd = now;

  const s = start || defaultStart;
  const e = end || defaultEnd;

  const startDate = new Date(s.getFullYear(), s.getMonth(), 1);
  const endDate = new Date(e.getFullYear(), e.getMonth(), 1);

  const months: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    months.push(current.toLocaleString('en-US', { month: 'short', year: '2-digit' }));
    current.setMonth(current.getMonth() + 1);
  }

  return months;
};

const allMonths = generateMonthRange(startDate, endDate);
const chartData = allMonths.map(month => {
  const value = orgsByMonth[month] || 0;
  return { month, value };
});


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-white px-5 py-2">
        <div className="mb-4">
          <CalendarPicker onDateChange={setDateRange} />
        </div>

        <div className="grid grid-cols-4 bg-[#011729] text-yellow-400 rounded-md overflow-hidden">
          {[
  { label: "High Risk Areas", value: countriesLoading ? <FaSpinner className="animate-spin text-gray-500" /> : countries?.length || 88 },
  { label: "Total Organizations", value: orgsLoading ? <FaSpinner className="animate-spin text-gray-500" /> : filteredOrgs.length },
  { label: "Active Organizations", value: orgsLoading ? <FaSpinner className="animate-spin text-gray-500" /> : activeOrganizations.length },
  { label: "Total Queries", value: queriesLoading ? <FaSpinner className="animate-spin text-gray-500" /> : filteredQueries.length },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 border-r border-teal-800 last:border-r-0">
              <p className="text-xl">{stat.label}</p>
    <div className="flex justify-center items-center h-8 text-2xl">
      {stat.value}
    </div>
            </div>
          ))}
        </div>
        

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 shadow hover:bg-blue-100 transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Active Organizations</h2>
            <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
    <XAxis dataKey="month" interval={0} />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#0f2e2e" />
  </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-100 rounded-lg p-4 shadow hover:bg-blue-100 transition-shadow">
            <h2 className="text-lg font-semibold mb-4">AI Functionality</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

  <div className="bg-blue-100 rounded-lg p-4 shadow hover:bg-blue-100 transition-shadow">
    <h2 className="text-lg font-semibold mb-4">Number of High-Risk Countries</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={countriesChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0f2e2e"  strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-gray-50 rounded-lg p-2 shadow hover:bg-gray-100 transition-shadow">
  <h2 className="text-lg font-semibold mb-4">High-Risk Countries</h2>
  {countriesLoading ? (
    <p className="text-gray-500">{loading ? (

    <FaSpinner className="animate-spin text-gray-500" />

) : (
  <p className="text-2xl font-bold"></p>
)}</p>
  ) : countries && countries.length > 0 ? (
    <div className="max-h-70 overflow-y-auto pr-2 space-y-2">
      {countries.map((country: any) => (
        <div
          key={country.country_id}
          className="px-3 py-2 bg-[#0f2e2e] rounded border border-gray-200 text-white"
        >
          {country.countries_name}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No high-risk countries found.</p>
  )}
</div>
</div>
      </div>
    </div>
  );
}