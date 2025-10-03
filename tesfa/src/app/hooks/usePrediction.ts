
import { useState, useEffect } from 'react';
import { fetchPredictions } from '../utils/fetchPredictions';

export interface DiseaseRisk {
  disease_name?: string;
  risk_level?: string;
  risk_percent?: number;
}

export interface Prediction {
  prediction_id: number;
  description: string;
  disease_risks: Array<DiseaseRisk | string>;
  date_generated: string;
  agent: any;
  region: string | null;
  country: string | null;
  lng: null | number;
  lat: null | number;
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
