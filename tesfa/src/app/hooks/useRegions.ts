import { useState, useEffect } from 'react';
import { fetchRegions } from '../utils/fetchRegions';

export interface Region {
  region_id: string;
  region_name: string;
  country: string;
  geometry: any;
  is_affected: boolean;
}

export const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRegions();
        setRegions(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { regions, loading, error };
};