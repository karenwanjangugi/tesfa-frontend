
import { useState, useEffect } from 'react';
import { fetchPredictions } from '../utils/fetchPredictions';
import { Prediction } from '../utils/type';

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPredictions();
        setPredictions(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { predictions, loading, error };
};
