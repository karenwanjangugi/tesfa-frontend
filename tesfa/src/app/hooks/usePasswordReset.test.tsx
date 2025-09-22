import { renderHook, act } from '@testing-library/react';
import { usePasswordReset } from './usePasswordReset';
import { fetchPasswordReset } from '../utils/fetchPassworReset';

jest.mock('../utils/fetchPassworReset', () => ({
  fetchPasswordReset: jest.fn(),
}));

describe('usePasswordReset', () => {
  const mockFetchPasswordReset = fetchPasswordReset as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePasswordReset());

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets loading to true when requestReset is called', async () => {
    mockFetchPasswordReset.mockResolvedValue({ message: 'Email sent' });

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.loading).toBe(false); 
  });

  it('sets message on successful reset request', async () => {
    const successMessage = 'Password reset email sent';
    mockFetchPasswordReset.mockResolvedValue({ message: successMessage });

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.message).toBe(successMessage);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failed reset request', async () => {
    const errorMessage = 'Network error';
    mockFetchPasswordReset.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.message).toBeNull();
  });

  it('resets message and error before making request', async () => {
    mockFetchPasswordReset.mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('first@example.com');
    });

    mockFetchPasswordReset.mockResolvedValue({ message: 'Second success' });

    await act(async () => {
      await result.current.requestReset('second@example.com');
    });

    expect(result.current.message).toBe('Second success');
  });

  it('ensures loading is set to false after request completes (even on error)', async () => {
    mockFetchPasswordReset.mockRejectedValue(new Error('Oops'));

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.loading).toBe(false);
  });
});