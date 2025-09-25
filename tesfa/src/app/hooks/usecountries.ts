"use client";
import { useEffect, useState } from "react";
import { getCountries } from "../utils/fetchcountries";
export function useCountries() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getCountries()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}