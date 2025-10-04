"use client";
import React from 'react';
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RiSidebarFoldLine } from "react-icons/ri";
import { HiSquares2X2 } from "react-icons/hi2";
import { LuClock3, LuClipboardList, LuUser, LuLogOut } from "react-icons/lu";


interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
  path?: string;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, isOpen, active, onClick }: SidebarItemProps) => {
  return (
    <div
      className={`flex items-center gap-6 p-2 rounded-2xl cursor-pointer transition-colors
      ${active ? "bg-active-gradient text-[00353D] font-semibold" : "hover:bg-teal-800"}`}
      onClick={onClick}
    >
      <div className="flex justify-center w-8">{icon}</div>
      <span
        className={`text-md transition-opacity duration-150 whitespace-nowrap
          ${isOpen ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
    </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path); 
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    router.push("/login"); 
  };

  return (
    <div
      className={`h-screen rounded-4xl bg-[#00363E] text-white flex flex-col justify-between transition-all duration-300
      ${isOpen ? "w-60 py-6 px-4" : "w-16 px-2 py-6"}`}
    >
    
      <div>
        <div className="flex  justify-between mb-20">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-teal-800 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            <RiSidebarFoldLine size={30} />
          </button>
          <div
            className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className={`${isOpen ? "" : "hidden"}`}
            >
            <img src={"/Images/TesfaLogo.png"} alt="Tesfa Logo"></img>
            </div>
          </div>
        </div>
      
        <nav className="flex flex-col gap-10">
          <SidebarItem
            icon={<HiSquares2X2 size={30} />}
            label="Dashboard"
            isOpen={isOpen}
            active={pathname === "/dashboard" || pathname === "/"}
            path="/dashboard"
            onClick={() => handleNavigation("/dashboard")}
          />
          <SidebarItem
            icon={<LuClipboardList size={30} />}
            label="Tasks"
            isOpen={isOpen}
            active={pathname === ""}
            path="/tasks"
            onClick={() => handleNavigation("/tasks")}
          />
          <SidebarItem
            icon={<LuClock3 size={30} />}
            label="Task Tracking"
            isOpen={isOpen}
            active={pathname === ""}
            path="/kanban"
            onClick={() => handleNavigation("/kanban")}
          />
  
          <SidebarItem
            icon={<LuUser size={30} />}
            label="Profile"
            isOpen={isOpen}
            active={pathname === ""}
            path="/profile"
            onClick={() => handleNavigation("/profile")}
          />
        </nav>
      </div>
   
      <div className="mb-4">
        <SidebarItem
          icon={<LuLogOut size={30} />}
          label="Logout"
          isOpen={isOpen}
          active={pathname === ""}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;