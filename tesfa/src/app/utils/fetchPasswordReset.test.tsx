import { fetchPasswordReset } from "./fetchPassworReset";
type FetchMock = jest.MockedFunction<typeof global.fetch>;

describe('fetchPasswordReset', () => {
  let mockFetch: FetchMock;

  beforeEach(() => {

    mockFetch = jest.fn() as FetchMock;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends correct request to /api/password-reset', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Email sent' }),
    } as Response);

    const payload = { email: 'test@example.com' };
    const result = await fetchPasswordReset(payload);

    expect(mockFetch).toHaveBeenCalledWith('/api/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(result).toEqual({ message: 'Email sent' });
  });

  it('throws descriptive error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      text: async () => 'Invalid email format',
    } as unknown as Response); 

    await expect(fetchPasswordReset({ email: 'bad-email' })).rejects.toThrow(
      'Failed to request password reset: Invalid email format'
    );
  });

  it('falls back to statusText if response body is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
      text: async () => '',
    } as unknown as Response);

    await expect(fetchPasswordReset({ email: 'test@example.com' })).rejects.toThrow(
      'Failed to request password reset: Internal Server Error'
    );
  });

  it('throws network error with wrapped message on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

    await expect(fetchPasswordReset({ email: 'test@example.com' })).rejects.toThrow(
      'Error requesting password reset: Network error'
    );
  });

  it('handles unexpected error during response.json()', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    } as unknown as Response);

    await expect(fetchPasswordReset({ email: 'test@example.com' })).rejects.toThrow(
      'Error requesting password reset: Unexpected token'
    );
  });
});