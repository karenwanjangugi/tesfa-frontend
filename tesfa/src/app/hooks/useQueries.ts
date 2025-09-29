import { useEffect, useState } from "react";
import { Query, fetchQueries } from "../utils/fetchqueries";

export const useFetchQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchQueries();
        setQueries(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { queries, loading, error };
};