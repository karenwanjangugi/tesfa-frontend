
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useRegister from "@/app/hooks/useRegister";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useRegister(); 

  const [formData, setFormData] = useState({
    organization: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "password" || name === "confirmPassword") {
        if (updated.password && updated.confirmPassword && updated.password !== updated.confirmPassword) {
          setFormError("Passwords do not match.");
        } else {
          setFormError(null);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { organization, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const result = await register({
      org_name: organization,
      email,
      password,
      password2: confirmPassword,
      role: "organization",
    });

    if (result) {
     
      router.push("/onboarding/login");
    }
  };

  return (
   
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#FDF6F6] px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row items-center gap-x-50 max-w-screen-xl w-full mx-auto">
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
          <h2 className="text-xl md:text-5xl font-semibold text-[#CDA12B] mb-6 relative inline-block">
            Create Account
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-[#CDA12B] to-transparent"></span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 mt-12 text-black">
            <div>
              <label htmlFor="organization" className="block text-2xl font-light text-[#00353D] mb-1">
                Organization name
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                placeholder="Enter organization name"
                value={formData.organization}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl text-[#00353D] focus:ring-2 focus:ring-[#CDA12B] focus:border-transparent transition"
                required
              />
            </div>
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
                className="w-full p-3 border border-gray-300 rounded-xl text-[#00353D] focus:ring-2 focus:ring-[#CDA12B] focus:border-transparent transition"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-2xl font-light text-[#00353D] mb-1">
                Password
              </label>
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl text-[#00353D] focus:ring-2 focus:ring-[#CDA12B] focus:border-transparent transition pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                className="absolute cursor-pointer right-3 top-12 text-[#00353D] text-xl"
                tabIndex={-1}
                aria-label={showPassword.password ? "Hide password" : "Show password"}
              >
                {showPassword.password ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-2xl font-light text-[#00353D] mb-1">
                Confirm password
              </label>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 text-[#00353D] rounded-xl focus:ring-2 focus:ring-[#CDA12B] focus:border-transparent transition pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                className="absolute right-3 cursor-pointer top-12 text-[#00353D] text-xl"
                tabIndex={-1}
                aria-label={showPassword.confirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showPassword.confirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {formError && <p className="text-red-500 text-sm text-center mt-2">{formError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00353D] text-white font-extrabold py-3 rounded-xl hover:bg-[#00695C] transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 mt-5 cursor-pointer"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <p className="text-[#00353D] text-center text-xl mt-4 font-extralight cursor-pointer" >
              Do you have an account?{" "}
              <a href="/onboarding/login" className="text-[#CDA12B] font-extrabold hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}