import { renderHook, act } from '@testing-library/react';
import usePasswordResetConfirm from './usePasswordConfirm';
import { fetchPasswordResetConfirm } from '../utils/fetchPasswordResetConfirm';

jest.mock('../utils/fetchPasswordResetConfirm', () => ({
  fetchPasswordResetConfirm: jest.fn(),
}));

describe('usePasswordResetConfirm', () => {
  const mockFetchConfirm = fetchPasswordResetConfirm as jest.MockedFunction<
    typeof fetchPasswordResetConfirm
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    uidb64: 'abc123',
    token: 'xyz789',
    new_password: 'newPass123!',
    confirm_password: 'newPass123!',
  };

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePasswordResetConfirm());

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set loading to true during confirmReset, then false after', async () => {
    mockFetchConfirm.mockResolvedValue({ message: 'Success!' });

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      await result.current.confirmReset(validPayload);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set success message on successful password reset', async () => {
    const successMsg = 'Password updated successfully';
    mockFetchConfirm.mockResolvedValue({ message: successMsg });

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      await result.current.confirmReset(validPayload);
    });

    expect(result.current.message).toBe(successMsg);
    expect(result.current.error).toBeNull();
  });

  it('should set fallback success message if response has no message', async () => {
    mockFetchConfirm.mockResolvedValue({});

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      await result.current.confirmReset(validPayload);
    });

    expect(result.current.message).toBe('Password reset successful');
    expect(result.current.error).toBeNull();
  });


  it('should set error message on failure', async () => {
    const errorMsg = 'Invalid token';
    mockFetchConfirm.mockRejectedValue(new Error(errorMsg));

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      try {
        await result.current.confirmReset(validPayload);
      } catch (err) {
    
      }
    });

    expect(result.current.error).toBe(errorMsg);
    expect(result.current.message).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should set generic error if error has no message', async () => {
    mockFetchConfirm.mockRejectedValue({});

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      try {
        await result.current.confirmReset(validPayload);
      } catch (err) {
       
      }
    });

    expect(result.current.error).toBe('Something went wrong');
    expect(result.current.message).toBeNull();
  });


  it('should reset message and error before making new request', async () => {
    mockFetchConfirm.mockRejectedValueOnce(new Error('First error'));

    const { result } = renderHook(() => usePasswordResetConfirm());

    await act(async () => {
      try {
        await result.current.confirmReset(validPayload);
      } catch {}
    });

    expect(result.current.error).toBe('First error');

    mockFetchConfirm.mockResolvedValueOnce({ message: 'All good now' });

    await act(async () => {
      await result.current.confirmReset(validPayload);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.message).toBe('All good now');
  });

  it('should return API response on success', async () => {
    const mockResponse = { message: 'Done', success: true };
    mockFetchConfirm.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePasswordResetConfirm());

    let returnedValue;
    await act(async () => {
      returnedValue = await result.current.confirmReset(validPayload);
    });

    expect(returnedValue).toEqual(mockResponse);
  });
});