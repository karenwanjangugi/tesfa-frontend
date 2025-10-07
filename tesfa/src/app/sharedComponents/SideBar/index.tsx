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
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { 
        setIsOpen(false); 
      }
    };

    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setIsOpen(false); 
      } else {
        setIsOpen(false); 
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) { 
      setIsMobileOpen(false);
    }
  };

const handleLogoutClick = () => setShowLogoutConfirm(true);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken"); 
    router.push("/onboarding/login"); 
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          data-testid="mobile-open-button"
          className="p-2 rounded-md bg-[#00363E] text-white hover:bg-teal-800 transition"
          onClick={() => setIsMobileOpen(true)}
        >
          <RiSidebarFoldLine size={30} />
        </button>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen rounded-4xl bg-[#00363E] text-white flex flex-col justify-between transition-all duration-300
        ${isMobileOpen ? "w-60 py-6 px-4" : "w-0 p-0 overflow-hidden"} 
        lg:static lg:flex
        ${isOpen ? "lg:w-60 lg:py-6 lg:px-4" : "lg:w-16 lg:px-2 lg:py-6"}`}
      >
    
        <div>
          <div className="flex justify-between mb-20">
            <button
              data-testid="mobile-close-button"
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-teal-800 transition lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <RiSidebarFoldLine size={30} />
            </button>
            <button
              data-testid="desktop-toggle-button"
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-md hover:bg-teal-800 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              <RiSidebarFoldLine size={30} />
            </button>
            <div
              className={`transition-opacity duration-300 ${isOpen || isMobileOpen ? "opacity-100" : "opacity-0"}`}
            >
              <div
                className={`${isOpen || isMobileOpen ? "" : "hidden"}`}
              >
              <img src={"/Images/tesfaLogo.png"} alt="Tesfa Logo"></img>
              </div>
            </div>
          </div>
              {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black opacity-85 flex items-center justify-center z-50">
          <div className="bg-blue-50 p-10 rounded-lg shadow-lg max-w-xs w-full">
            <h2 className="text-lg font-bold mb-2 text-[#00363E]">Confirm Logout</h2>
            <p className="mb-4 text-gray-700">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleLogoutCancel}
                className="px-6 py-2 cursor-pointer rounded-2xl  bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-6 py-2 cursor-pointer rounded-2xl bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
        
          <nav className="flex flex-col gap-10">
            <SidebarItem
              icon={<HiSquares2X2 size={30} />}
              label="Dashboard"
              isOpen={isOpen || isMobileOpen}
              active={pathname === "/dashboard" || pathname === "/"}
              path="/dashboard"
              onClick={() => handleNavigation("/dashboard")}
            />
            <SidebarItem
              icon={<LuClipboardList size={30} />}
              label="Tasks"
              isOpen={isOpen || isMobileOpen}
              active={pathname === "/tasks"}
              path="/tasks"
              onClick={() => handleNavigation("/tasks")}
            />
            <SidebarItem
              icon={<LuClock3 size={30} />}
              label="Task Tracking"
              isOpen={isOpen || isMobileOpen}
              active={pathname === "/kanban"}
              path="/kanban"
              onClick={() => handleNavigation("/kanban")}
            />
    
            <SidebarItem
              icon={<LuUser size={30} />}
              label="Profile"
              isOpen={isOpen || isMobileOpen}
              active={pathname === "/profile"}
              path="/profile"
              onClick={() => handleNavigation("/profile")}
            />
          </nav>
        </div>
     
        <div className="mb-4">
          <SidebarItem
            icon={<LuLogOut size={30} />}
            label="Logout"
            isOpen={isOpen || isMobileOpen}
            active={pathname === ""}
              onClick={handleLogoutClick}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;