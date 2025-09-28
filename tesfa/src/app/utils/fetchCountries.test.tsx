
import { fetchCountries } from './fetchCountries'; 

global.fetch = jest.fn();

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('fetchCountries', () => {
  const mockToken = 'abc123';
  const mockCountries = [{ id: 1, name: 'USA' }, { id: 2, name: 'Canada' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error if no token is found', async () => {
    (global.localStorage.getItem as jest.Mock).mockReturnValue(null);

    await expect(fetchCountries()).rejects.toThrow('No token found in localStorage. Please log in.');
  });

  it('fetches countries successfully with valid token', async () => {
    (global.localStorage.getItem as jest.Mock).mockReturnValue(mockToken);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCountries),
    });

    const result = await fetchCountries();

    expect(global.localStorage.getItem).toHaveBeenCalledWith('Token');
    expect(global.fetch).toHaveBeenCalledWith('/api/countries', {
      headers: {
        Authorization: `Token ${mockToken}`,
      },
    });
    expect(result).toEqual(mockCountries);
  });

  it('throws error if response is not ok', async () => {
    (global.localStorage.getItem as jest.Mock).mockReturnValue(mockToken);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(fetchCountries()).rejects.toThrow('Something went wrong: Internal Server Error');
  });
});