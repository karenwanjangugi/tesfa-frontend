"use client";
import { useEffect, useState } from "react";
import { getOrganizations } from "../utils/fetchOrganization";
export function useOrganizations() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getOrganizations()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}
