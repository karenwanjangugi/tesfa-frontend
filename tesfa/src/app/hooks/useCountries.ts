import { useState, useEffect } from 'react';
import { fetchCountries } from '../utils/fetchCountries';
import { Country } from '../utils/type';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { countries, loading, error };
};