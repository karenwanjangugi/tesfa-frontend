
import { fetchPredictions } from './fetchPredictions'; 

global.fetch = jest.fn();
const mockLocalStorage = {
  getItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('fetchPredictions', () => {
  const mockToken = 'test-token-123';
  const mockResponseData = { predictions: [1, 2, 3] };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      statusText: 'OK',
      json: async () => mockResponseData,
    });
  });

  it('fetches predictions successfully with valid token', async () => {
    const result = await fetchPredictions();

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    expect(global.fetch).toHaveBeenCalledWith('/api/prediction', {
      headers: {
        Authorization: `Token ${mockToken}`,
      },
    });
    expect(result).toEqual(mockResponseData);
  });

  it('throws an error if no token is found in localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    await expect(fetchPredictions()).rejects.toThrow(
      'No token found. Please set token in localStorage first.'
    );
  });

  it('throws an error when fetch response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Forbidden',
      json: async () => ({}),
    });

    await expect(fetchPredictions()).rejects.toThrow(
      'Something went wrong: Forbidden'
    );
  });

  it('wraps network errors with descriptive message', async () => {
    const networkError = new Error('Failed to fetch');
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(fetchPredictions()).rejects.toThrow(
      `Error fetching predictions: ${networkError.message}`
    );
  });
});