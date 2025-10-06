"use client";
import { useState, useEffect } from 'react';
import { fetchApiUsageStats } from '../utils/fetchApiUsage';

export type ApiUsageStat = {
  week: string;
  [key: string]: number | string;
};

const useFetchApiUsageStats = () => {
  const [data, setData] = useState<ApiUsageStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

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
        const result = await fetchApiUsageStats();
        setData(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchApiUsageStats;