"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";



export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#fdf6f6] px-6 md:px-12 py-12 ${josefinSans.className}">
     
      <div className="flex flex-col md:flex-row items-center gap-x-50 max-w-screen-xl w-full">
        
        
        <div className="flex justify-center mb-8 md:mb-0">
          <Image
            src="/Images/Group 184.png"
            alt="Logo"
            width={500}
            height={200}
            className="rounded-full drop-shadow-lg"
          />
        </div>

        
        <div className="text-left max-w-md">
          <h1 className="text-4xl md:text-7xl font-normal text-[#CDA12B] mb-15 relative text-center">
            Welcome
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-transparent via-[#CDA12B] to-transparent"></span>
          </h1>

          <p className="text-[#00353D] font-light md:text-4xl leading-relaxed mb-8 text-center">
            By restoring health and safety, we help bring happiness and brighter futures to those who need it most.
          </p>

          <button
            onClick={() => router.push("/onboarding/register")}
            className="w-full bg-[#00353D] text-white text-base md:text-2xl cursor-pointer font-extrabold px-8 py-3 rounded-md hover:bg-teal-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}