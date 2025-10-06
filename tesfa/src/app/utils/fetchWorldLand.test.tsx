
import { fetchWorldLand } from './fetchWorldLand';
global.fetch = jest.fn();
describe('fetchWorldLand', () => {
  const mockData = { id: 1, name: 'Earth' };
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });
  it('fetches and returns world land data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    const result = await fetchWorldLand();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/api/world-land');
  });
  it('throws error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });
    await expect(fetchWorldLand()).rejects.toThrow('Something went wrong, Not Found');
  });
  it('wraps network errors in custom error message', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchWorldLand()).rejects.toThrow('Error fetching world land: Network error');
  });
});