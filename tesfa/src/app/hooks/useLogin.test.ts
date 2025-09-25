
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useLogin from './useLogin';
import { fetchLogin } from '../utils/loginUtils';

jest.mock('../utils/loginUtils', () => ({
  fetchLogin: jest.fn(),
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return token and role on successful login', async () => {
    const mockResponse = { token: 'fake-token-123', role: 'user' };
    (fetchLogin as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.login({
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(returnedData).toEqual({ token: 'fake-token-123', role: 'user' });
  });

  it('should set loading and error on failure', async () => {
    (fetchLogin as jest.Mock).mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useLogin());

    let returnedData: any;
    await act(async () => {
      returnedData = await result.current.login({
        email: 'test@example.c// src/app/hooks/useLogin.test.tsom',
        password: 'wrong',
      });
    });

    expect(returnedData).toBeNull();
    expect(result.current.error).toBe('Login failed');
    expect(result.current.loading).toBe(false);
  });
});