// hooks/useFetchApiUsageStats.ts
import { useState, useEffect } from 'react';
import { fetchApiUsageStats } from '../utils/fetchApiUsage';

// Type matches your Django response: [{ week: "Sep 1–7", users: 120, queries: 500, ... }]
export type ApiUsageStat = {
  week: string; // or 'month' if you keep monthly — but you want weekly
  [key: string]: number | string;
};

const useFetchApiUsageStats = () => {
  const [data, setData] = useState<ApiUsageStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip on server (localStorage not available during SSR)
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to view API usage.');
        setLoading(false);
        return;
      }

      try {
        const result = await fetchApiUsageStats(token);
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchApiUsageStats;