import { renderHook, act } from '@testing-library/react';
import useLogin from './useLogin';
import { fetchLogin } from '../utils/loginUtils';

jest.mock('../utils/loginUtils', () => ({
  fetchLogin: jest.fn(),
}));

describe('useLogin', () => {
  const mockCredentials = {
    email: 'test@ngo.org',
    password: 'secure123',
  };

  const mockResponse = {
    token: 'fake-jwt-token-123',
  };

  beforeEach(() => {
    (fetchLogin as jest.Mock).mockClear();
  });

  it('should return token on successful login', async () => {
    (fetchLogin as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useLogin());

    let returnedData = null;
    await act(async () => {
      returnedData = await result.current.login(mockCredentials);
    });

    expect(returnedData).toEqual({
      token: mockResponse.token,
    });
  });

  it('should set error if login fails', async () => {
    (fetchLogin as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login(mockCredentials);
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.loading).toBe(false);
  });

  it('should set loading state during login', async () => {
    (fetchLogin as jest.Mock)
      .mockImplementationOnce(() => new Promise(() => {}));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.login(mockCredentials);
    });

    expect(result.current.loading).toBe(true);
  });
});