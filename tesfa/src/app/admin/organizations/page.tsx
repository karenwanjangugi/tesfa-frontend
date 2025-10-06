"use client";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import Layout from "../sharedcomponent/Layout";
import useFetchOrganizations from "../../hooks/useFetchOrganizations";

function formatDate(isoString: string | undefined) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit"
  });
}

const ORGANIZATIONS_PER_PAGE = 12;

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { organizations, loading, error } = useFetchOrganizations();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((organization) => {
      const matchesSearch =
        organization.org_name &&
        organization.org_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && organization.is_active === true) ||
        (statusFilter === "inactive" && organization.is_active === false);
      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrganizations.length / ORGANIZATIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORGANIZATIONS_PER_PAGE;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + ORGANIZATIONS_PER_PAGE);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const resolveImageUrl = (logoPath: string | null | undefined): string | null => {
    if (!logoPath || logoPath === "null") return null;
    if (logoPath.startsWith("http")) return logoPath;
    return logoPath.startsWith("/") ? logoPath : `/${logoPath}`;
  };

  return (
    <Layout>
      <div className="min-h-screen  bg-[#FCF6F7] ml-14">
        <div className="px-4">
          <main className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl mx-auto mb-12 gap-4">
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search organizations by name"
                    className="w-full h-10 px-10 text-sm rounded-full border border-[#8BB2B5] bg-white text-[#00353D] outline-none focus:ring-2 focus:ring-[#8BB2B5] placeholder-[#00353D]/50 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8BB2B5]">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>
              </div>
           
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                  className="h-10 px-8 cursor-pointer rounded-full border border-[#8BB2B5] bg-white text-[#00353D] outline-none focus:ring-2 focus:ring-[#8BB2B5] font-medium"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center mr-20 mt-80">Loading...</div>
            ) : error ? (
              <div className="flex justify-center items-center text-red-500 min-h-[200px]">{error}</div>
            ) : filteredOrganizations.length === 0 ? (
              <div className="flex justify-center text-[#00353D] items-center mr-15 mt-85">
                Organization not found
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-2">
                  {paginatedOrganizations.map((organization) => (
                    <div
                      key={organization.id}
                      className="w-full max-w-[230px] h-[200px] rounded-2xl overflow-hidden bg-white flex flex-col items-center shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                    >
                      <div className="bg-[#00353D] w-full h-16 relative flex justify-center">
                        <div
                          className="w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-md"
                          style={{
                            position: "absolute",
                            bottom: "-33px",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        >
                          {resolveImageUrl(organization.logo_image) ? (
                            <Image
                              src={resolveImageUrl(organization.logo_image)!}
                              alt="Org Logo"
                              width={60}
                              height={60}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-gray-400 text-xl">?</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center pt-8 pb-3 px-3 text-center w-full">
                        <div className="text-[20px] font-semibold text-[#00353D] mb-3 line-clamp-1">
                          {organization.org_name || "-"}
                        </div>
                        <div className="text-[#00353D] text-[15px] mb-1">
                          {formatDate(organization.created_at)}
                        </div>
                        <div className="text-[#00353D] text-[15px] line-clamp-1 px-1">
                          {organization.email}
                        </div>
                      
                        <div
                          className="text-xs mt-1 px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: organization.is_active ? "#D1FAE5" : "#FEE2E2",
                            color: organization.is_active ? "#065F46" : "#991B1B",
                          }}
                        >
                          {organization.is_active ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8 mb-10">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg cursor-pointer ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#00353D] text-white hover:bg-[#002A30]"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-[#00353D] font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg cursor-pointer ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#00353D] text-white hover:bg-[#002A30]"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}