import { fetchPasswordResetConfirm } from './fetchPasswordResetConfirm';
global.fetch = jest.fn();

describe('fetchPasswordResetConfirm', () => {
  const mockPayload = {
    uidb64: 'abc123',
    token: 'xyz789',
    new_password: 'newPass123!',
    confirm_password: 'newPass123!',
  };

  const baseUrl = '/api/password-reset-confirm';

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should make POST request with correct headers and body', async () => {
    const mockResponse = { message: 'Password reset confirmed' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchPasswordResetConfirm(mockPayload);

    expect(global.fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockPayload),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw descriptive error if response is not ok', async () => {
    const serverError = 'Invalid token or expired';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Forbidden',
      text: async () => serverError,
    });

    await expect(fetchPasswordResetConfirm(mockPayload)).rejects.toThrow(
      `Error confirming password reset: ${serverError}`
    );
  });

  it('should throw with statusText if response text is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
      text: async () => '',
    });

    await expect(fetchPasswordResetConfirm(mockPayload)).rejects.toThrow(
      'Error confirming password reset: Unauthorized'
    );
  });

  it('should throw with network error message if fetch fails', async () => {
    const networkError = new Error('Network timeout');

    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchPasswordResetConfirm(mockPayload)).rejects.toThrow(
      `Error confirming password reset: ${networkError.message}`
    );
  });

  it('should handle string error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('Something exploded');

    await expect(fetchPasswordResetConfirm(mockPayload)).rejects.toThrow(
      'Error confirming password reset: Something exploded'
    );
  });

  it('should handle object error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce({ code: 500, detail: 'Internal server panic' });

    await expect(fetchPasswordResetConfirm(mockPayload)).rejects.toThrow(
      'Error confirming password reset: [object Object]'
    );
  });
});