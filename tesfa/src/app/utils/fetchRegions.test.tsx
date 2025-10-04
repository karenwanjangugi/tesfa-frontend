
import { fetchRegions } from './fetchRegions'; 

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string): string | null => store[key] || null),
    setItem: jest.fn((key: string, value: any): void => {
      store[key] = String(value);
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});


beforeEach(() => {
  mockLocalStorage.clear();
  global.fetch = jest.fn(); 
});

afterEach(() => {
  jest.clearAllMocks(); 
});

describe('fetchRegions', () => {


  it('throws if no token in localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    await expect(fetchRegions()).rejects.toThrow('No token found');
  });

  it('fetches regions successfully', async () => {
    const token = 'valid-token';
    const mockData = { regions: ['East', 'West'] };

    mockLocalStorage.getItem.mockReturnValueOnce(token);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      statusText: 'OK',
      json: async () => mockData,
    });

    const result = await fetchRegions();
    expect(result).toEqual(mockData);

    expect(global.fetch).toHaveBeenCalledWith('/api/regions', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  });

  it('throws on non-OK response', async () => {
    const token = 'valid-token';

    mockLocalStorage.getItem.mockReturnValueOnce(token);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    });

    await expect(fetchRegions()).rejects.toThrow('Something went wrong: Internal Server Error');
  });

  it('throws with wrapped error on network failure', async () => {
    const token = 'valid-token';

    mockLocalStorage.getItem.mockReturnValueOnce(token);

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchRegions()).rejects.toThrow('Error fetching regions: Network Error');
  });
});