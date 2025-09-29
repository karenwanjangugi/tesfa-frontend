
import { fetchApiUsageStats } from './fetchApiUsage';

global.fetch = jest.fn();

describe('fetchApiUsageStats', () => {
  const mockData = [
    { week: '2023-01', calls: 100 },
    { week: '2023-02', calls: 150 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return API usage stats successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchApiUsageStats();

    expect(global.fetch).toHaveBeenCalledWith('/api/api-usage-stats');
    expect(result).toEqual(mockData);
  });

  it('should return empty array when response is not an array', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'not an array' }),
    });

    const result = await fetchApiUsageStats();

    expect(result).toEqual([]);
  });

  it('should throw error when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchApiUsageStats()).rejects.toThrow('Failed to fetch API usage');
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchApiUsageStats()).rejects.toThrow('Network error');
  });
});