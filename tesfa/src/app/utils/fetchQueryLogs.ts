const baseurl = '/api/queryLog';

export async function fetchQueries() {
  try {
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('user_id');

    if (!token) {
      throw new Error('No token found in localStorage. Please set it.');
    }
    if (!userId) {
      throw new Error('No user ID found in localStorage. Please set it.');
    }

    const response = await fetch(baseurl, {
      headers: {
        Authorization: `Token ${token}`,
        'X-User-Id': userId,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    const result = await response.json();

    if (result.userId && result.userId !== userId) {
      localStorage.setItem('user_id', result.userId);
    }

    return result;
  } catch (error) {
    throw new Error(`Error fetching queries: ${(error as Error).message}`);
  }
}

export async function postQuery(data: Record<string, any>) {
  if (typeof window === 'undefined') {
    throw new Error('postQuery can only run in the browser');
  }

  try {
    const token = localStorage.getItem('Token');
    const userId = localStorage.getItem('user_id');

    if (!token) {
      throw new Error('No token found in localStorage. Please set it.');
    }
    if (!userId) {
      throw new Error('No user ID found in localStorage. Please set it.');
    }

    const payload = { ...data, user_id: userId };

    const response = await fetch(baseurl, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Something went wrong: ' + errorText);
    }

    const result = await response.json();

    if (result.userId && result.userId !== userId) {
      localStorage.setItem('user_id', result.userId);
    }

    return result;
  } catch (error) {
    throw new Error(`Error posting query: ${(error as Error).message}`);
  }
}
