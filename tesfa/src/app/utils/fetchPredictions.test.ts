

import { fetchPredictions } from './fetchPredictions';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

(global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
  ok: true,
  statusText: 'OK',
  json: () => Promise.resolve({}),
});

describe('fetchPredictions', () => {
  const mockToken = 'mock-token-123';

  beforeEach(() => {
    localStorageMock.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });


  it('throws if no token in localStorage', async () => {
    await expect(fetchPredictions()).rejects.toThrow('No token found. Please set token in localStorage first.');
  });

  it('fetches predictions successfully', async () => {
    localStorage.setItem('Token', mockToken);

    const mockResponseData = { predictions: ['apple', 'banana'] };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
      statusText: 'OK',
    });

    const result = await fetchPredictions();

    expect(fetch).toHaveBeenCalledWith('/api/prediction', {
      headers: {
        Authorization: `Token ${mockToken}`,
      },
    });
    expect(result).toEqual(mockResponseData);
  });

  it('throws user-friendly error on fetch failure', async () => {
    localStorage.setItem('Token', mockToken);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchPredictions()).rejects.toThrow('Error fetching predictions: Something went wrong: Not Found');
  });

  it('throws user-friendly error on network/other error', async () => {
    localStorage.setItem('Token', mockToken);

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchPredictions()).rejects.toThrow('Error fetching predictions: Network error');
  });
});