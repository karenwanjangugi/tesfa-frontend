import { fetchQueries, postQuery } from './fetchQueryLogs';

global.fetch = jest.fn();

describe('fetchQueryLogs Utils', () => {
  const mockData = [{ id: 1, query: 'Hello', response: 'Hi there!' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchQueries should return data on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchQueries();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/api/chat');
  });

  it('fetchQueries should throw on HTTP error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchQueries()).rejects.toThrow('Something went wrong: Not Found');
  });

  it('postQuery should send correct payload and return response', async () => {
    const postData = { query: 'What is AI?' };
    const mockResponse = { id: 2, query: 'What is AI?', response: 'AI is...' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await postQuery(postData);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
  });

  it('postQuery should throw on HTTP error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    await expect(postQuery({ query: '' })).rejects.toThrow('Something went wrong: Bad Request');
  });
});