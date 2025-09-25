"use client";
import { useOrganizations } from "@/app/hooks/useorganizations";
import { useQueries } from "@/app/hooks/useQueries";
import { useState } from "react";
import { useCountries } from "@/app/hooks/usecountries";
import Sidebar from "../sharedcomponent/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CalendarPicker from "../sharedcomponent/Calender";

export default function DashboardPage() {
  const { data: orgs, loading: orgsLoading } = useOrganizations();
  const { data: queries, loading: queriesLoading } = useQueries();
  const { data: countries, loading: countriesLoading } = useCountries();
  const [date, setDate] = useState<Date>(new Date());

const activeOrganizations = orgs?.filter(
    (user: any) => 
      user.role === 'organization' && 
      user.is_active === true
  ) || [];

    const orgsByYear = activeOrganizations.reduce((acc: Record<string, number>, org: any) => {
    const year = new Date(org.created_at).getFullYear().toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});


  const chartData = Object.entries(orgsByYear)
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year.localeCompare(b.year)); 
const countriesByYear = countries?.reduce((acc: Record<string, number>, country: any) => {
    const year = new Date().getFullYear().toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {}) || {};


  const countriesChartData = Object.entries(countriesByYear)
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year.localeCompare(b.year)); 



  const pieData = [
    { name: "Predict", value: 40, color: "#0f2e2e" },
    { name: "List of Tasks", value: 30, color: "#facc15" },
    { name: "Summary and Analysis", value: 30, color: "#1e3a8a" },
  ];
  return (
    <div className="flex h-screen">
  
    
        <Sidebar/>
  
    
   
      <div className="flex-1 bg-white p-6">
      
        <div className="grid grid-cols-4 bg-[#011729] text-yellow-400 rounded-md overflow-hidden">
          {[
            { label: "High Risk Areas", value: `${countries.length}` },
            { label: "Total Organizations", value: `${orgs.length}` },
            { label: "Active Organizations", value: `${activeOrganizations.length}` },
            { label: "Total Queries", value: 180 },
          
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 border-r border-teal-800 last:border-r-0">
              <p className="text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
    
        <div className="grid grid-cols-2 gap-6 mt-6">
     
          <div className="bg-blue-50 rounded-lg p-4 shadow hover:bg-blue-100 transition-shadow">
            <h2 className="text-lg font-semibold mb-4">Active Organizations</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0f2e2e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
     
          <div className="bg-blue-50 rounded-lg p-4 shadow hover:bg-blue-100 transition-shadow">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              AI Functionality
                     <CalendarPicker onDateChange={(newDate) => setDate(newDate)} />
            </h2>
            <ResponsiveContainer width="100%" height={250}>
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
     
        <div className="bg-blue-50 rounded-lg p-4 shadow hover:bg-blue-100 transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Number of High-Risk Countries</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={countriesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0f2e2e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}