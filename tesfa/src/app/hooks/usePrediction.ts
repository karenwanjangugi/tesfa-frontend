import { useState, useEffect } from 'react';
import { fetchPredictions } from '../utils/fetchPredictions';

export interface Prediction {
  lng: null;
  lat: null;
  prediction_id: number;
  agent: any;
  region: string | null;
  country: string | null;
  description: string;
  disease_risks: string[];
  date_generated: string;
}

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