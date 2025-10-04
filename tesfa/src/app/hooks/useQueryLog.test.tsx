import { renderHook, act, waitFor } from '@testing-library/react';
import { useQueryLog} from './useQueryLog';
import {QueryLog} from '../utils/type'
import * as fetchModule from '../utils/fetchQueryLogs';

jest.mock('../utils/fetchQueryLogs');

const mockFetchQueries = fetchModule.fetchQueries as jest.MockedFunction<typeof fetchModule.fetchQueries>;
const mockPostQuery = fetchModule.postQuery as jest.MockedFunction<typeof fetchModule.postQuery>;

describe('useQueryLog hook', () => {
  const sampleLogs: QueryLog[] = [
    { id: 1, query: 'test query 1', response: 'response 1' },
    { id: 2, query: 'test query 2', response: 'response 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load query logs on initial render', async () => {
    mockFetchQueries.mockResolvedValueOnce(sampleLogs);

    const { result } = renderHook(() => useQueryLog());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchQueries).toHaveBeenCalledTimes(1);
    expect(result.current.logs).toEqual(sampleLogs);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetchQueries error', async () => {
    mockFetchQueries.mockRejectedValueOnce(new Error('Fetch failed'));

    const { result } = renderHook(() => useQueryLog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.logs).toEqual([]);
    expect(result.current.error).toBe('Fetch failed');
  });

  it('should optimistically add a new query log and update after postQuery', async () => {
    const newLogResponse: QueryLog = { id: 100, query: 'new query', response: 'new response' };

    mockFetchQueries.mockResolvedValueOnce(sampleLogs);
    mockPostQuery.mockResolvedValueOnce(newLogResponse);

    const { result } = renderHook(() => useQueryLog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      void result.current.submitQuery('new query');
    });

    expect(result.current.logs.length).toBe(sampleLogs.length + 1);
    expect(result.current.logs.some(log => log.query === 'new query')).toBe(true);


    await waitFor(() => {
      const updatedLog = result.current.logs.find(log => log.query === 'new query' && log.response === 'new response');
      expect(updatedLog).toBeDefined();
    });

    expect(result.current.error).toBeNull();
  });

  it('should remove optimistic log and set error if postQuery fails', async () => {
    mockFetchQueries.mockResolvedValueOnce(sampleLogs);
    mockPostQuery.mockRejectedValueOnce(new Error('Post failed'));

    const { result } = renderHook(() => useQueryLog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.submitQuery('fail query');
      } catch {}
    });

 
    expect(result.current.logs.find(log => log.query === 'fail query')).toBeUndefined();
    expect(result.current.error).toBe('Post failed');
  });

  it('should not submit empty or whitespace queries', async () => {
    mockFetchQueries.mockResolvedValueOnce(sampleLogs);

    const { result } = renderHook(() => useQueryLog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.submitQuery('   ');
      await result.current.submitQuery('');
      await result.current.submitQuery('\n\t');
    });


    expect(result.current.logs).toEqual(sampleLogs);
  });

  it('refetch function reloads the logs', async () => {
    mockFetchQueries.mockResolvedValueOnce(sampleLogs);

    const { result } = renderHook(() => useQueryLog());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newLogs: QueryLog[] = [
      { id: 10, query: 'refetched query', response: 'refetched response' },
    ];

    mockFetchQueries.mockResolvedValueOnce(newLogs);

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockFetchQueries).toHaveBeenCalledTimes(2);
    expect(result.current.logs).toEqual(newLogs);
  });
});
