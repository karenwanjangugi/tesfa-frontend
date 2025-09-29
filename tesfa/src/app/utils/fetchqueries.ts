import { getToken } from "./getToken";

export interface Query {
  id: number;
  question: string;
  created_at: string;
  // add other fields
}

export async function fetchQueries(): Promise<Query[]> {
  const token = getToken();
  if (!token) throw new Error('No token found.');

  const res = await fetch('/api/queries', {
    headers: { Authorization: `Token ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch queries');
  }

  return res.json();
}