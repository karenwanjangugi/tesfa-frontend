'use client';
import { useState, useEffect } from 'react';
import { fetchUsers, User } from '../utils/fetchOrganizations';


const useFetchOrganizations = () => {
  const [organizations, setOrganizations] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const refetch = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setOrganizations(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    refetch();
  }, []);


  return { organizations, loading, error, refetch };
};


export default useFetchOrganizations;