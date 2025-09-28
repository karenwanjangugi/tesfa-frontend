import { useState, useEffect } from 'react';
import { fetchCountries } from '../utils/fetchCountries';

export interface Country {
  country_id: string;
  countries_name: string;
  geometry: any;
  is_affected: boolean;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { countries, loading, error };
};