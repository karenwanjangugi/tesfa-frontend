import { fetchQueries, postQuery } from './fetchQueryLogs';

const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

describe('fetchQueries', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeAll(() => {
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('throws error if no token in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'user_id' ? '123' : null
    );

    await expect(fetchQueries()).rejects.toThrow(
      'Error fetching queries: No token found. Please set it.'
    );
  });

  it('throws error if no user_id in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'Token' ? 'token_value' : null
    );

    await expect(fetchQueries()).rejects.toThrow(
      'Error fetching queries: No user ID found. Please set it.'
    );
  });

  it('throws error if fetch response is not ok', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'Token' ? 'token_value' : key === 'user_id' ? 'user_1' : null
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as unknown as Response);

    await expect(fetchQueries()).rejects.toThrow(
      'Error fetching queries: Something went wrong: Internal Server Error'
    );
  });

  it('returns JSON response and updates localStorage if userId changes', async () => {
    const responseData = { userId: 'user_2', data: ['query1', 'query2'] };

    localStorageMock.getItem.mockImplementation((key) =>
      key === 'Token' ? 'token_value' : key === 'user_id' ? 'user_1' : null
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(responseData),
    } as unknown as Response);

    const result = await fetchQueries();

    expect(result).toEqual(responseData);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user_id', 'user_2');
  });
});

describe('postQuery', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeAll(() => {
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('throws error if no token in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'user_id' ? '123' : null
    );

    await expect(postQuery({ query: 'test' })).rejects.toThrow(
      'Error posting query: No token found in localStorage. Please set it.'
    );
  });

  it('throws error if no user_id in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'Token' ? 'token_value' : null
    );

    await expect(postQuery({ query: 'test' })).rejects.toThrow(
      'Error posting query: No user ID found in localStorage. Please set it.'
    );
  });

  it('throws error if response not ok', async () => {
    localStorageMock.getItem.mockImplementation((key) =>
      key === 'Token' ? 'token_value' : key === 'user_id' ? 'user_1' : null
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: jest.fn().mockResolvedValue('Bad Request'),
    } as unknown as Response);

    await expect(postQuery({ query: 'test' })).rejects.toThrow(
      'Error posting query: Something went wrong: Bad Request'
    );
  });

  it('returns json data and updates localStorage userId if changed', async () => {
    const responseData = { userId: 'user_2', message: 'Success' };

    localStorageMock.getItem.mockImplementation((key) =>
      key === 'Token' ? 'token_value' : key === 'user_id' ? 'user_1' : null
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(responseData),
    } as unknown as Response);

    const result = await postQuery({ query: 'test' });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/queryLog',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Token token_value',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ query: 'test', user_id: 'user_1' }),
      })
    );

    expect(result).toEqual(responseData);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user_id', 'user_2');
  });
});
