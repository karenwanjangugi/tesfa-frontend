import { fetchRegister } from './registerUtils';

global.fetch = jest.fn();

describe('fetchRegister', () => {
  const mockUserData = {
    org_name: 'Test NGO',
    email: 'test@ngo.org',
    password: 'secure123',
    password2: 'secure123',
    role: 'organization',
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should return response on successful registration', async () => {
    const mockResponse = { message: 'User registered successfully' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchRegister(mockUserData);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if registration fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    await expect(fetchRegister(mockUserData)).rejects.toThrow(
      'Failed to register: Registration failed: Bad Request'
    );
  });

  it('should throw an error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchRegister(mockUserData)).rejects.toThrow(
      'Failed to register: Network error'
    );
  });
});