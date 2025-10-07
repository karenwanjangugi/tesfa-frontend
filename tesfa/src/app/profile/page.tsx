"use client";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Calendar, Edit2 } from "lucide-react";
import Image from "next/image";
import useFetchOrganization from "@/app/hooks/useFetchOrganization";
import Layout from "../sharedComponents/Layout";
import { useFetchTaskAssignments } from "@/app/hooks/useFetchTaskAssignment";
import TaskSummary from "./components/TaskSummary";

function formatDate(isoString: string | undefined) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { assignedTasks } = useFetchTaskAssignments();
  const { user: profile, loading, error } = useFetchOrganization();
  const completedTasks = assignedTasks.filter((task) => task.status === "completed");
  const totalTasks = assignedTasks.length;

  // Always render Layout
  return (
    <Layout>
      <div className="flex flex-col w-full items-center bg-[#FCF6F7] h-screen overflow-y-auto">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-8 xl:mt-25 mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-[#00353D] mb-2">
            Profile
          </h1>
          <div className="w-full h-[6px] bg-[#8BB2B5] rounded" />
        </div>

        <div className="flex flex-col lg:flex-row items-start w-full max-w-7xl gap-10 px-4 sm:px-6 md:px-8 lg:px-10 pb-20">
          <div className="w-full lg:w-1/2 bg-[#00363E] rounded-3xl shadow-lg">
            <div className="relative flex flex-col items-center p-22 ">
              {/* Loading/Error states */}
              {error && (
                <div className="text-red-500 text-center p-4 w-full">
                  {error}
                </div>
              )}
              {/* Show loading spinner or skeleton while loading */}
              {loading && (
                <div className="flex items-center justify-center w-full h-[180px]">
                  <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C3A041]"></span>
                </div>
              )}
              {/* Render content only if profile is loaded and not loading */}
              {!loading && profile && (
                <>
                  <div className="w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] absolute  rounded-full border-4 border-[#C3A041] flex items-center justify-center overflow-hidden bg-white">
                    {profile.logo_image && (
                      <Image
                        src={profile.logo_image.startsWith("http")
                          ? profile.logo_image
                          : `${process.env.API_URL}${profile.logo_image}`}
                        alt="Organization Logo"
                        width={150}
                        height={150}
                        className="object-contain"
                        unoptimized={false}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => router.push("/edit-profile")}
                    className="absolute top-55 cursor-pointer right-55 w-9 h-9 bg-white border border-[#C3A041] rounded-full flex items-center justify-center shadow hover:bg-[#F3FBFD] transition"
                    aria-label="Edit Profile"
                    type="button"
                  >
                    <Edit2 className="w-4 h-4  text-[#C3A041]" />
                  </button>
                </>
              )}
            </div>

            <div className="w-full bg-[#F3FBFD] rounded-3xl p-6 sm:p-10 flex flex-col gap-6 shadow-inner">
              {/* Show skeleton or actual data */}
              {loading && (
                <div className="text-center text-gray-400">Loading profile...</div>
              )}
              {!loading && profile && (
                <>
                  <div className="flex flex-col sm:flex-row items-start mt-25 sm:items-center gap-3 w-full">
                    <UserIcon className="w-7 h-7 text-[#C3A041]" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium">
                        Organization name:
                      </p>
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium break-words">
                        {profile.org_name}
                      </p>
                    </div>
                  </div>
                  {/* ...other fields... */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <Mail className="w-7 h-7 text-[#C3A041]" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-36">
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium">
                        Email:
                      </p>
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium break-words">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <Calendar className="w-7 h-7 text-[#C3A041]" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-9">
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium">
                        Registration Date:
                      </p>
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium">
                        {formatDate(profile.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <Calendar className="w-7 h-7 text-[#C3A041]" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-11">
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium">
                        Tasks Completed:
                      </p>
                      <p className="text-lg sm:text-xl text-[#00353D] font-medium">
                        {completedTasks.length}/{totalTasks} Tasks
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <TaskSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
}