
import { fetchQueries, postQuery } from './fetchQueryLogs';

global.fetch = jest.fn();


const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    mockReset() {
      this.clear();
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('fetchQueries', () => {
  const token = 'abc123';
  const userId = 'user-42';

  beforeEach(() => {
    localStorageMock.mockReset();
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', userId);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      statusText: 'OK',
      json: async () => ({ logs: [] }),
    });
  });

  it('fetches queries with correct headers', async () => {
    await fetchQueries();

    expect(fetch).toHaveBeenCalledWith('/api/queryLog', {
      headers: {
        Authorization: `Token ${token}`,
        'X-User-Id': userId,
      },
    });
  });

  it('returns the response data', async () => {
    const mockData = { logs: [{ id: 1 }] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchQueries();
    expect(result).toEqual(mockData);
  });

  it('throws if token is missing', async () => {
    localStorage.setItem('token', '');
    await expect(fetchQueries()).rejects.toThrow('No token found. Please set it.');
  });

  it('throws if user_id is missing', async () => {
    localStorage.setItem('user_id', '');
    await expect(fetchQueries()).rejects.toThrow('No user ID found. Please set it.');
  });

  it('updates user_id in localStorage if response has a new userId', async () => {
    const newUserId = 'user-99';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: newUserId, logs: [] }),
    });

    await fetchQueries();
    expect(localStorage.getItem('user_id')).toBe(newUserId);
  });

  it('does not update user_id if response userId matches current', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId, logs: [] }),
    });

    await fetchQueries();

    expect(localStorage.getItem('user_id')).toBe(userId);
  });

  it('throws on non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Forbidden',
    });

    await expect(fetchQueries()).rejects.toThrow('Something went wrong: Forbidden');
  });

  it('wraps unexpected errors', async () => {
    const error = new Error('Network failure');
    (fetch as jest.Mock).mockRejectedValueOnce(error);

    await expect(fetchQueries()).rejects.toThrow(
      `Error fetching queries: ${error.message}`
    );
  });
});

describe('postQuery', () => {
  const token = 'xyz789';
  const userId = 'user-101';
  const inputData = { query: 'What is AI?' };

  beforeEach(() => {
    localStorageMock.mockReset();
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', userId);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('posts query with correct payload and headers', async () => {
    await postQuery(inputData);

    const expectedPayload = { ...inputData, user_id: userId };
    expect(fetch).toHaveBeenCalledWith('/api/queryLog', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expectedPayload),
    });
  });


  it('throws if token is missing', async () => {
    localStorage.setItem('token', '');
    await expect(postQuery(inputData)).rejects.toThrow(
      'No token found in localStorage. Please set it.'
    );
  });

  it('throws if user_id is missing', async () => {
    localStorage.setItem('user_id', '');
    await expect(postQuery(inputData)).rejects.toThrow(
      'No user ID found in localStorage. Please set it.'
    );
  });

  it('updates user_id from response if changed', async () => {
    const newUserId = 'user-202';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: newUserId }),
    });

    await postQuery(inputData);
    expect(localStorage.getItem('user_id')).toBe(newUserId);
  });

  it('uses response.text() for POST error details', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => 'Invalid syntax',
    });

    await expect(postQuery(inputData)).rejects.toThrow(
      'Something went wrong: Invalid syntax'
    );
  });

  it('wraps POST errors', async () => {
    const error = new Error('Timeout');
    (fetch as jest.Mock).mockRejectedValueOnce(error);

    await expect(postQuery(inputData)).rejects.toThrow(
      `Error posting query: ${error.message}`
    );
  });
});