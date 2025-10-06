
import { renderHook, waitFor } from '@testing-library/react';
import useFetchApiUsageStats from './usefetchApiusage';
import { fetchApiUsageStats } from '../utils/fetchApiUsage';

jest.mock('../utils/fetchApiUsage', () => ({
  fetchApiUsageStats: jest.fn(),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockFetchApiUsageStats = fetchApiUsageStats as jest.MockedFunction<
  typeof fetchApiUsageStats
>;

describe('useFetchApiUsageStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localStorageMock.getItem as jest.Mock).mockReturnValue(null); 
  });



  it('should show error if no token in localStorage', async () => {
    const { result } = renderHook(() => useFetchApiUsageStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('You must be logged in to view API usage.');
    expect(result.current.data).toEqual([]);
  });

  it('should fetch and return API usage stats on success', async () => {
    const mockData = [
      { month: '2024-06', total_calls: 150 },
      { month: '2024-05', total_calls: 200 },
    ];

    mockFetchApiUsageStats.mockResolvedValueOnce(mockData);
    (localStorageMock.getItem as jest.Mock).mockReturnValue('valid-token');

    const { result } = renderHook(() => useFetchApiUsageStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('');
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle API fetch error', async () => {
    mockFetchApiUsageStats.mockRejectedValueOnce(new Error('Network error'));
    (localStorageMock.getItem as jest.Mock).mockReturnValue('valid-token');

    const { result } = renderHook(() => useFetchApiUsageStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
  });

  it('should not run on the server (SSR)', () => {
  
    const originalWindow = global.window;


    // @ts-ignore
    delete global.window;

    try {
      const { result } = renderHook(() => useFetchApiUsageStats());

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([]);
    
    } finally {
 
      global.window = originalWindow;
    }
  });
});