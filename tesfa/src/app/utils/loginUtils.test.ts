import { fetchLogin } from './loginUtils';

global.fetch = jest.fn();

describe('fetchLogin', () => {
  const mockCredentials = {
    email: 'test@ngo.org',
    password: 'secure123',
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should return token on successful login', async () => {
    const mockResponse = { token: 'fake-jwt-token-123' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchLogin(mockCredentials);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if login fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    });

    await expect(fetchLogin(mockCredentials)).rejects.toThrow(
      'Failed to login: Login failed: Unauthorized'
    );
  });

  it('should throw an error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchLogin(mockCredentials)).rejects.toThrow(
      'Failed to login: Network error'
    );
  });
});