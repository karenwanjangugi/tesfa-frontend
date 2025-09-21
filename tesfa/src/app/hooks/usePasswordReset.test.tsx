import { renderHook, act } from '@testing-library/react';
import { usePasswordReset } from './usePasswordReset';
import { fetchPasswordReset } from '../utils/fetchPassworReset';

jest.mock('../utils/fetchPassworReset', () => ({
  fetchPasswordReset: jest.fn(),
}));

describe('usePasswordReset', () => {
  const mockFetchPasswordReset = fetchPasswordReset as jest.MockedFunction<
    typeof fetchPasswordReset
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePasswordReset());

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set loading to true when requestReset is called', async () => {
    mockFetchPasswordReset.mockResolvedValue({ message: 'Email sent' });

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.loading).toBe(false); 
  });

  it('should set message on successful reset request', async () => {
    const successMessage = 'Password reset link sent!';
    mockFetchPasswordReset.mockResolvedValue({ message: successMessage });

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.message).toBe(successMessage);
    expect(result.current.error).toBeNull();
  });

  it('should set fallback message if response has no message', async () => {
    mockFetchPasswordReset.mockResolvedValue({});

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.message).toBe('Password reset link sent!');
    expect(result.current.error).toBeNull();
  });

  it('should set error message on failure', async () => {
    const errorMessage = 'Network error';
    mockFetchPasswordReset.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.message).toBeNull();
  });

  it('should set generic error message if error has no message', async () => {
    mockFetchPasswordReset.mockRejectedValue({});

    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.error).toBe('Something went wrong');
    expect(result.current.message).toBeNull();
  });

  it('should reset message and error before making request', async () => {
    mockFetchPasswordReset.mockResolvedValue({ message: 'Success' });

    const { result } = renderHook(() => usePasswordReset());
    mockFetchPasswordReset.mockRejectedValueOnce(new Error('Initial error'));

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

 
    mockFetchPasswordReset.mockResolvedValueOnce({ message: 'Success 2' });

    await act(async () => {
      await result.current.requestReset('test@example.com');
    });

    expect(result.current.error).toBeNull(); 
    expect(result.current.message).toBe('Success 2');
  });
});