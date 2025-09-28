// app/hooks/useAffectedRegions.ts
"use client";

import { useEffect, useState } from "react";
import { fetchAffectedRegions } from "../utils/fetchAffectedCountries";

export type Region = {
  region_id: string;
  region_name: string;
  is_affected: boolean;
  geometry: any;
};

export function useAffectedRegions() {
  const [data, setData] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const regions = await fetchAffectedRegions(); 
      setData(regions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  return { data, loading, error };
}