import { fetchCountries } from './fetchCountries';
global.fetch = jest.fn();
describe('fetchCountries', () => {
  const mockToken = 'mock-token';
  const mockCountries = [{ id: 1, name: 'USA' }, { id: 2, name: 'Canada' }];
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    localStorage.clear();
  });
  it('throws error if no token in localStorage', async () => {
    await expect(fetchCountries()).rejects.toThrow('No token found in localStorage. Please log in.');
  });
  it('throws error if fetch response is not ok', async () => {
    localStorage.setItem('Token', mockToken);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });
    await expect(fetchCountries()).rejects.toThrow('Something went wrong, Not Found');
  });
  it('throws error if response JSON is empty array', async () => {
    localStorage.setItem('Token', mockToken);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    await expect(fetchCountries()).rejects.toThrow('No countries found.');
  });
  it('throws error if response JSON is null', async () => {
    localStorage.setItem('Token', mockToken);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });
    await expect(fetchCountries()).rejects.toThrow('No countries found.');
  });
  it('returns countries when fetch is successful', async () => {
    localStorage.setItem('Token', mockToken);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries,
    });
    const result = await fetchCountries();
    expect(result).toEqual(mockCountries);
    expect(global.fetch).toHaveBeenCalledWith('/api/countries', {
      headers: { Authorization: `Token ${mockToken}` },
    });
  });
  it('wraps unexpected errors in custom message', async () => {
    localStorage.setItem('Token', mockToken);
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));
    await expect(fetchCountries()).rejects.toThrow('Error fetching countries: Network failure');
  });
});