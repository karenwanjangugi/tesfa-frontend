"use client";
import React from "react";
import Link from "next/link";
const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0E545F] overflow-hidden">
      <div className="absolute top-10 left-10 w-15">
          <img src="/Images/Tlogo.png" alt=""/>
      </div>
<div className="absolute top-10 left-10 w-15">
          <img src="/Images/Tlogo.png" alt=""/>
      </div>
           <div className="absolute -bottom-45 -right-20 w-100 h-100 rounded-full border-[10px] border-[#011d1f]  opacity-40"></div>
            <div className="absolute -bottom-70 -right-45 w-150 h-150 rounded-full border-[100px] border-[#05393a]  opacity-40"></div>
            <div className="absolute -bottom-70 -right-45 w-150 h-150 rounded-full border-[10px] border-[#011d1f]  opacity-40"></div>
       
      <div className="bg-[#00353D] py-15 px-15 rounded-2xl shadow-lg flex flex-col items-center space-y-6">

      
        <div className="w-20 h-20 rounded-full bg-[#d4af37] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      
        <h1 className="text-2xl font-bold text-white">Successful</h1>
        <p className="text-gray-200 text-center w-60">
          Your password has successfully changed
        </p>
       
        <Link href="/dashboard">
          <button className="mt-4 px-6 py-2 bg-[#d4af37] text-[#015c63] font-semibold rounded-md hover:bg-yellow-500 transition">
            Back To Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};
export default SuccessPage;





