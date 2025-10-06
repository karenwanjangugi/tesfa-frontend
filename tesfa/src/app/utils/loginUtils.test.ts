import { fetchLogin, logout } from './loginUtils';


global.fetch = jest.fn();


const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('fetchLogin', () => {
  const credentials = { email: 'test@example.com', password: 'pass123' };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    localStorageMock.clear();
  });

  it('should log in successfully and store token & user_id', async () => {
    const mockResponseText = JSON.stringify({
      token: 'abc123',
      user_id: 42,
      email: 'test@example.com',
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponseText,
    });

    const result = await fetchLogin(credentials);

    expect(result).toEqual({
      token: 'abc123',
      user_id: 42,
      email: 'test@example.com',
    });
    expect(localStorage.getItem('token')).toBe('abc123');
    expect(localStorage.getItem('user_id')).toBe('42');
  });

  it('should handle login failure with field-specific errors', async () => {
    const errorResponse = {
      email: ['Invalid email'],
      password: ['Too short'],
    };
    const mockResponseText = JSON.stringify(errorResponse);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      text: async () => mockResponseText,
    });

    await expect(fetchLogin(credentials)).rejects.toThrow(
      'email: Invalid email\npassword: Too short'
    );
  });

  it('should handle login failure with "detail" error', async () => {
    const mockResponseText = JSON.stringify({ detail: 'Invalid credentials' });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchLogin(credentials)).rejects.toThrow('Invalid credentials');
  });

  it('should handle login failure with "non_field_errors"', async () => {
    const mockResponseText = JSON.stringify({
      non_field_errors: ['Unable to log in with provided credentials.'],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => mockResponseText,
    });

    await expect(fetchLogin(credentials)).rejects.toThrow(
      'Unable to log in with provided credentials.'
    );
  });

  it('should handle plain text error response', async () => {
    const plainTextError = 'Forbidden';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => plainTextError,
    });

    await expect(fetchLogin(credentials)).rejects.toThrow('Forbidden');
  });

  it('should handle network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network unreachable'));

    await expect(fetchLogin(credentials)).rejects.toThrow(
      'Failed to login: Network unreachable'
    );
  });
});

describe('logout', () => {
  it('should remove token and user_id from localStorage', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('user_id', '42');

    logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user_id')).toBeNull();
  });
});