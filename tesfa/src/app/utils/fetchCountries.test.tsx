
import { fetchCountries } from "./fetchCountries";
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

describe('fetchCountries', () => {
  const token = 'country-token-789';
  const mockCountries = [{ id: 1, name: 'Ethiopia' }, { id: 2, name: 'Kenya' }];

  beforeEach(() => {
    localStorageMock.mockReset();
    localStorage.setItem('token', token);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      statusText: 'OK',
      json: async () => mockCountries,
    });
  });

 

  it('throws error if no token is found', async () => {
    localStorage.setItem('token', '');
    await expect(fetchCountries()).rejects.toThrow('No token found. Please log in.');
  });

  it('throws error on non-ok HTTP response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    });

    await expect(fetchCountries()).rejects.toThrow('Something went wrong, Unauthorized');
  });

  it('throws error when response is empty array', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await expect(fetchCountries()).rejects.toThrow('No countries found.');
  });

  it('throws error when response is null or undefined', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    await expect(fetchCountries()).rejects.toThrow('No countries found.');
  });

  it('throws error when response is undefined (edge case)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => undefined,
    });

    await expect(fetchCountries()).rejects.toThrow('No countries found.');
  });

  it('wraps network errors with descriptive message', async () => {
    const networkError = new Error('Failed to connect to server');
    (fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchCountries()).rejects.toThrow(
      `Error fetching countries: ${networkError.message}`
    );
  });
});