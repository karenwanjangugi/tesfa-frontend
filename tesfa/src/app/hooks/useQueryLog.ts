"use client";
import { useState, useEffect } from 'react';
import { fetchQueries, postQuery } from '../utils/fetchQueryLogs';
import { QueryLog } from '../utils/type';

export const useQueryLog = () => {
  const [logs, setLogs] = useState<QueryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQueries();
      setLogs(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const optimisticLog: QueryLog = {
      id: Date.now(),
      query: queryText,
    };
    setLogs(prev => [...prev, optimisticLog]);

    try {
      const newLog = await postQuery({ query: queryText });
      setLogs(prev => 
        prev.map(log => 
          log.id === optimisticLog.id ? { ...newLog, id: optimisticLog.id } : log
        )
      );
      return newLog;
    } catch (err) {
      setError((err as Error).message);
      setLogs(prev => prev.filter(log => log.id !== optimisticLog.id));
      throw err;
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  return { logs, loading, error, submitQuery, refetch: loadQueries, setLogs };
};
