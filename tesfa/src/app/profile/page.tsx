"use client";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Calendar, Edit2 } from "lucide-react";
import useFetchOrganization from "../hooks/useFetchOrganization";
import Layout from "../sharedComponents/Layout";

function formatDate(isoString: string | undefined) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
}
export default function ProfilePage() {
  const router = useRouter();
  const { user: profile, loading, error } = useFetchOrganization();

  if (loading) return <div className="flex justify-center items-center text-center min-h-screen"><p>Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center text-center min-h-screen text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <Layout>
    <main className="flex w-full flex-col items-center min-h-screen bg-[#FCF6F7] overflow-x-hidden">
      <div className="w-full px-10 mx-auto m-10">
        <h1 className="text-4xl font-medium text-[#00353D] mb-2">Profile</h1>
        <div className="w-full h-[6px] bg-[#8BB2B5] rounded" />
      </div>
      <div className="flex flex-col items-center mt-16 w-full">
        <div className="relative mb-8 flex flex-col items-center">
          <div className="w-[200px] h-[200px] rounded-full border-4 border-[#C3A041] flex items-center justify-center overflow-hidden bg-white mx-auto">
            {profile.logo_image &&
              profile.logo_image.trim() !== "" && (
                <img
                  src={
                    profile.logo_image.startsWith("http")
                      ? profile.logo_image
                      : `${process.env.API_URL}${profile.logo_image}`
                  }
                  alt="Organization Logo"
                  className="object-contain w-[180px] h-[180px]"
                />
              )}
          </div>
         <button
  onClick={() => router.push("/edit-profile")}
  className="absolute bottom-2 right-5 w-9 h-9 bg-white border border-[#C3A041] rounded-full flex items-center justify-center shadow hover:bg-[#f3fbfd] cursor-pointer"
  aria-label="Edit Profile"
  type="button"
>
  <Edit2 className="w-5 h-5 text-[#C3A041]" />
</button>
        </div>
        <div className="w-full max-w-lg bg-[#F3FBFD] rounded-2xl flex flex-col items-center shadow-[12px_12px_32px_rgba(0,0,0,0.15)] px-7 py-10 gap-8">
          <div className="flex items-center gap-4 w-full">
            <UserIcon className="w-8 h-8 text-[#C3A041]" />
            <div>
              <p className="text-xl text-[#00353D] font-medium mb-1">Organization name</p>
              <p className="text-xl text-[#00353D] font-medium">{profile.org_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full">
            <Mail className="w-8 h-8 text-[#C3A041]" />
            <div>
              <p className="text-xl text-[#00353D] font-medium mb-1">Email</p>
              <p className="text-xl text-[#00353D] font-medium break-words">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full">
            <Calendar className="w-8 h-8 text-[#C3A041]" />
            <div>
              <p className="text-xl text-[#00353D] font-medium mb-1">Registration Date</p>
              <p className="text-xl text-[#00353D] font-medium">{formatDate(profile.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </Layout>
  );
}