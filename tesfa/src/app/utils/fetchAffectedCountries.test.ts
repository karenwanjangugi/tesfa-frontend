
import { fetchAffectedCountries } from './fetchAffectedCountries';
import { getToken } from './getToken';

jest.mock('./getToken');
global.fetch = jest.fn();

describe('fetchAffectedCountries', () => {
  const mockToken = 'mock-auth-token';
  const mockCountries = [{ id: 1, name: 'USA' }, { id: 2, name: 'Canada' }];

  beforeEach(() => {
    jest.clearAllMocks();
    (getToken as jest.Mock).mockReturnValue(mockToken);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      statusText: 'OK',
      json: async () => mockCountries,
    });
  });

  it('should fetch countries successfully with valid token', async () => {
    const result = await fetchAffectedCountries();

    expect(getToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/countries', {
      headers: {
        Authorization: `Token ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockCountries);
  });

  it('should throw error when user is not authenticated', async () => {
    (getToken as jest.Mock).mockReturnValue(null);

    await expect(fetchAffectedCountries()).rejects.toThrow('User is not authenticated');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw error when API returns non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchAffectedCountries()).rejects.toThrow('Failed to fetch countries: Not Found');
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetchAffectedCountries()).rejects.toThrow('Network error');
  });
});