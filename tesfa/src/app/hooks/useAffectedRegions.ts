// app/hooks/useAffectedRegions.ts
"use client";

import { useEffect, useState } from "react";
import { fetchAffectedCountries } from "../utils/fetchAffectedCountries";

export type Country = {
  country_id: string;
  country_name: string;
  is_affected: boolean;
  geometry: any;
};

export function useAffectedCountries() {
  const [data, setData] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const countries = await fetchAffectedCountries(localStorage.getItem('Token') || ''); 
      setData(countries);
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