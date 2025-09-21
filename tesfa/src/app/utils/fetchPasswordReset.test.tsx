import { fetchPasswordReset } from './fetchPassworReset';
global.fetch = jest.fn();

describe('fetchPasswordReset', () => {
  const email = 'test@example.com';
  const baseUrl = '/api/password-reset';

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should make POST request with correct headers and body', async () => {
    const mockResponse = { message: 'Email sent' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchPasswordReset({ email });

    expect(global.fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw descriptive error if response is not ok', async () => {
    const serverError = 'Invalid email format';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      text: async () => serverError,
    });

    await expect(fetchPasswordReset({ email })).rejects.toThrow(
      `Error requesting password reset: ${serverError}`
    );
  });

  it('should throw with statusText if response text is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
      text: async () => '',
    });

    await expect(fetchPasswordReset({ email })).rejects.toThrow(
      'Error requesting password reset: Unauthorized'
    );
  });

  it('should throw with network error message if fetch fails', async () => {
    const networkError = new Error('Network connection failed');

    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchPasswordReset({ email })).rejects.toThrow(
      `Error requesting password reset: ${networkError.message}`
    );
  });

  it('should handle unexpected error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('Something exploded');

    await expect(fetchPasswordReset({ email })).rejects.toThrow(
      'Error requesting password reset: Something exploded'
    );
  });
});