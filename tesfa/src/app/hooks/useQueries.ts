// hooks/useFetchQueries.ts
import { useState, useEffect } from 'react';
import { fetchQueries } from '../utils/fetchqueries';

export type Query = {
  query_id: string;
  user: number;
  agent: number | null;
  query: string;
  response: string;
  created_at: string;
};

const useFetchQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchData = async () => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null;
    console.log('Token:', token); // 🔍

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchQueries(token);
      console.log('Fetched queries:', data); // 🔍
      setQueries(data);
    } catch (err: any) {
      console.error('Hook fetch error:', err); // 🔍
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  return { queries, loading, error };
};

export default useFetchQueries;