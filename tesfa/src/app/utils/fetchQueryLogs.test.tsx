import { fetchQueries, postQuery } from './fetchQueryLogs';

describe('fetchQueries', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('throws error if no token in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user_id') return '123';
      if (key === 'Token') return null; 
      return null;
    });

    await expect(fetchQueries()).rejects.toThrow('No token found in localStorage. Please set it.');
  });

  it('throws error if no user_id in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'Token') return 'token_value';
      if (key === 'user_id') return null; 
      return null;
    });

    await expect(fetchQueries()).rejects.toThrow('No user ID found in localStorage. Please set it.');
  });

  it('throws error if fetch response is not ok', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'Token') return 'token_value';
      if (key === 'user_id') return 'user_1';
      return null;
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as unknown as Response);

    await expect(fetchQueries()).rejects.toThrow('Something went wrong: Internal Server Error');
  });

  it('returns JSON response and updates localStorage if userId changes', async () => {
    const responseData = { userId: 'user_2', data: ['query1', 'query2'] };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'Token') return 'token_value';
      if (key === 'user_id') return 'user_1';
      return null;
    });

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
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('throws error if no token in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user_id') return '123';
      if (key === 'Token') return null; 
      return null;
    });

    await expect(postQuery({ query: 'test' })).rejects.toThrow('No token found in localStorage. Please set it.');
  });

  it('throws error if no user_id in localStorage', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'Token') return 'token_value';
      if (key === 'user_id') return null; 
      return null;
    });

    await expect(postQuery({ query: 'test' })).rejects.toThrow('No user ID found in localStorage. Please set it.');
  });

  it('throws error if response not ok', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'Token') return 'token_value';
      if (key === 'user_id') return 'user_1';
      return null;
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: jest.fn().mockResolvedValue('Bad Request'),
    } as unknown as Response);

    await expect(postQuery({ query: 'test' })).rejects.toThrow('Something went wrong: Bad Request');
  });

  it('returns json data and updates localStorage userId if changed', async () => {
    const responseData = { userId: 'user_2', message: 'Success' };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'Token') return 'token_value';
      if (key === 'user_id') return 'user_1';
      return null;
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(responseData),
    } as unknown as Response);

    const data = { query: 'test' };
    const result = await postQuery(data);

    expect(global.fetch).toHaveBeenCalledWith('/api/queryLog', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: 'Token token_value',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ ...data, user_id: 'user_1' }),
    }));

    expect(result).toEqual(responseData);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user_id', 'user_2');
  });
});
