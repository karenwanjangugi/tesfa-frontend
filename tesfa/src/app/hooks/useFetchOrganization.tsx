'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../utils/fetchOrganizations";

export type User = {
  email: string;
  role: string;
  org_name?: string;
  logo_image?: string;
  created_at?: string;
};

const useFetchOrganization = () => {
  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ["organizationProfile"],
    queryFn: fetchProfile,
  });

  return { user, loading, error: error ? (error as Error).message : null, refetch };
};

export default useFetchOrganization;