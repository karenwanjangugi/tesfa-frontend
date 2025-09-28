
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useLogin from "@/app/hooks/useLogin";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useLogin(); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(formData);

    if (result) {
      localStorage.setItem("token", result.token);    
      if(result.role === "admin"){
        router.push("/admin/dashboard");
      }else{
        router.push("/dashboard");
      }
  
      
    }
  };

  return (
  
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#FDF6F6] px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row items-center gap-x-49 max-w-screen-xl w-full mx-auto">
        <div className="flex justify-center mb-8 md:mb-0">
          <Image
            src="/Images/Group 184.png"
            alt="Logo"
            width={500}
            height={200}
            className="rounded-full drop-shadow-lg"
          />
        </div>
        <div className="md:w-1/2 text-left max-w-md">
          <h2 className="text-xl md:text-5xl text-center font-light text-[#CDA12B] mb-8 relative ">
            Welcome Back!
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-[#CDA12B] to-transparent"></span>
          </h2>
          <p className="text-[#00353D] text-4xl font-normal text-center">Login</p>
          <form onSubmit={handleSubmit} className="space-y-5 mt-15 text-black ">
            <div>
              <label htmlFor="email" className="block text-2xl font-light text-[#00353D] mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2  text-[#00353D] focus:ring-[#CDA12B] focus:border-transparent transition"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-2xl font-light text-[#00353D] mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl  text-[#00353D] focus:ring-2 focus:ring-[#CDA12B] focus:border-transparent transition pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-12 text-[#00353D] text-xl"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <Link
            href="/reset-password"
            className="text-sm text-gray-500 hover:underline mb-4 inline-block cursor-pointer"
            >
              Forgot password?
            </Link>
          
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00353D] text-white font-extrabold py-3 rounded-xl hover:bg-[#00695C] transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <p className="text-center text-[#00353D] text-xl mt-4">
              Don’t have an account?{" "}
              <a href="/onboarding/register" className="text-[#CDA12B] font-bold hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}