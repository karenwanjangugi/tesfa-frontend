"use client";
import { useEffect, useState } from "react";
import { getQueries } from "../utils/fetchqueries";
export function useQueries() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getQueries()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}