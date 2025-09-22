
import { renderHook, act } from '@testing-library/react';
import useRegister from './useRegister';
import { fetchRegister } from '../utils/registerUtils';

jest.mock('../utils/registerUtils', () => ({
  fetchRegister: jest.fn(),
}));

describe('useRegister', () => {
  const mockUserData = {
    org_name: 'Test NGO',
    email: 'test@ngo.org',
    password: 'secure123',
    password2: 'secure123',
    role: 'organization'
  };

  const mockResponse = {
    id: 1,
    org_name: 'Test NGO',
    email: 'test@ngo.org',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should set loading to true during API call and false after', async () => {
    
    (fetchRegister as jest.Mock).mockResolvedValueOnce(mockResponse);

   
    const { result } = renderHook(() => useRegister());

    expect(result.current.loading).toBe(false);


    await act(async () => {
      await result.current.register(mockUserData);
    });

    expect(result.current.loading).toBe(false);
  });


  it('should return data on successful registration and not set error', async () => {
   
    (fetchRegister as jest.Mock).mockResolvedValueOnce(mockResponse);

    
    const { result } = renderHook(() => useRegister());

    let returnedData = null;
    await act(async () => {
      returnedData = await result.current.register(mockUserData);
    });

    
    expect(returnedData).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

 
  it('should set error if registration fails', async () => {
    
    const errorMessage = 'Registration failed: Bad Request';
    (fetchRegister as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.register(mockUserData);
    });

    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });
});