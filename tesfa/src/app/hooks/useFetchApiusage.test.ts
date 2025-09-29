const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

import { renderHook, waitFor } from '@testing-library/react';
import useFetchApiUsageStats from './usefetchApiusage';
import { fetchApiUsageStats } from '../utils/fetchApiUsage';

jest.mock('../utils/fetchApiUsage', () => ({
  fetchApiUsageStats: jest.fn(),
}));

describe('useFetchApiUsageStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReset();
  });


  it('should return loading state initially', () => {
  
    (fetchApiUsageStats as jest.Mock).mockReturnValue(new Promise(() => {}));
    mockLocalStorage.getItem.mockReturnValue('valid-token');

    const { result } = renderHook(() => useFetchApiUsageStats());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch data successfully when token exists', async () => {
    const mockData = [{ week: '2023-01', calls: 100 }];
    (fetchApiUsageStats as jest.Mock).mockResolvedValue(mockData);
    mockLocalStorage.getItem.mockReturnValue('valid-token');

    const { result } = renderHook(() => useFetchApiUsageStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should set error when no token exists', async () => {
    mockLocalStorage.getItem.mockReturnValue(null); 

    const { result } = renderHook(() => useFetchApiUsageStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('You must be logged in to view API usage.');
  });

  it('should handle fetch errors', async () => {
    (fetchApiUsageStats as jest.Mock).mockRejectedValue(new Error('API failed'));
    mockLocalStorage.getItem.mockReturnValue('valid-token');

    const { result } = renderHook(() => useFetchApiUsageStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('API failed');
  });
});