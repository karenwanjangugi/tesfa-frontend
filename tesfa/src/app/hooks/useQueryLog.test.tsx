import { renderHook, act } from '@testing-library/react';
import { useQueryLog, QueryLog } from './useQueryLog'; 
import * as FetchQueryLogs from '../utils/fetchQueryLogs';

jest.mock('../utils/fetchQueryLogs', () => ({
  fetchQueries: jest.fn(),
  postQuery: jest.fn(),
}));

const mockFetchQueries = FetchQueryLogs.fetchQueries as jest.MockedFunction<
  typeof FetchQueryLogs.fetchQueries
>;
const mockPostQuery = FetchQueryLogs.postQuery as jest.MockedFunction<
  typeof FetchQueryLogs.postQuery
>;


const waitForNextUpdate = async (callback: () => boolean) => {
  let timeoutId: NodeJS.Timeout;
  return new Promise<void>((resolve, reject) => {
    const check = () => {
      if (callback()) {
        clearTimeout(timeoutId);
        resolve();
      } else {
        timeoutId = setTimeout(check, 10);
      }
    };
    check();
  
    setTimeout(() => reject(new Error('waitFor timeout')), 1000);
  });
};

describe('useQueryLog', () => {
  const sampleLogs: QueryLog[] = [
    { id: 1, query: 'SELECT * FROM users', response: 'success', created_at: '2024-01-01' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchQueries.mockResolvedValue(sampleLogs);
  });

  it('loads logs on mount', async () => {
    const { result } = renderHook(() => useQueryLog());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

  
    await act(async () => {
      await waitForNextUpdate(() => !result.current.loading);
    });

    expect(mockFetchQueries).toHaveBeenCalledTimes(1);
    expect(result.current.logs).toEqual(sampleLogs);
  });

  it('handles fetch error gracefully', async () => {
    mockFetchQueries.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useQueryLog());

    await act(async () => {
      await waitForNextUpdate(() => !result.current.loading);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
    expect(result.current.logs).toHaveLength(0);
  });

  it('submits a new query optimistically and updates on success', async () => {
    const serverResponse: QueryLog = {
      id: 999, 
      query: 'INSERT INTO logs',
      response: 'created',
      created_at: '2024-06-01',
    };

    mockPostQuery.mockResolvedValue(serverResponse);

    const { result } = renderHook(() => useQueryLog());

    await act(async () => {
      await waitForNextUpdate(() => !result.current.loading);
    });

    const queryText = 'my optimistic query';

    await act(async () => {
      await result.current.submitQuery(queryText);
    });


    const optimisticLog = result.current.logs.find(log => log.query === queryText);
    expect(optimisticLog).toBeDefined();
    expect(optimisticLog?.id).toBeDefined();
    expect(typeof optimisticLog?.id).toBe('number');

 
    const updatedLog = result.current.logs.find(log => log.id === optimisticLog!.id);
    expect(updatedLog).toEqual({
      ...serverResponse,
      id: optimisticLog!.id, 
    });
  });

  it('removes optimistic log and sets error on submit failure', async () => {
    mockPostQuery.mockRejectedValueOnce(new Error('Submission failed'));

    const { result } = renderHook(() => useQueryLog());

    await act(async () => {
      await waitForNextUpdate(() => !result.current.loading);
    });

    const queryText = 'failing query';

 
    await expect(
      act(async () => {
        await result.current.submitQuery(queryText);
      })
    ).rejects.toThrow('Submission failed');

    const failedLog = result.current.logs.find(log => log.query === queryText);
    expect(failedLog).toBeUndefined();


    expect(result.current.error).toBe('Submission failed');
  });

  it('does not submit empty or whitespace-only queries', async () => {
    const { result } = renderHook(() => useQueryLog());

    await act(async () => {
      await waitForNextUpdate(() => !result.current.loading);
    });

    await act(async () => {
      await result.current.submitQuery('   ');
    });

    expect(mockPostQuery).not.toHaveBeenCalled();
    expect(result.current.logs).toEqual(sampleLogs);
  });

  it('refetches logs when refetch is called', async () => {
    const { result } = renderHook(() => useQueryLog());

    await act(async () => {
      await waitForNextUpdate(() => !result.current.loading);
    });

    const refetchedLogs: QueryLog[] = [
      { id: 2, query: 'REFETCHED', response: 'ok' },
    ];
    mockFetchQueries.mockResolvedValueOnce(refetchedLogs);

    await act(async () => {
      await result.current.refetch();
      await waitForNextUpdate(() => !result.current.loading);
    });

    expect(mockFetchQueries).toHaveBeenCalledTimes(2);
    expect(result.current.logs).toEqual(refetchedLogs);
  });
});