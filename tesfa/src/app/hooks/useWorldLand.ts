import { useState, useEffect } from 'react';
import { fetchWorldLand } from '../utils/fetchWorldLand';

const useWorldLand = () => {
  const [worldLand, setWorldLand] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchWorldLand();
        setWorldLand(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { worldLand, loading, error };
};

export default useWorldLand;
