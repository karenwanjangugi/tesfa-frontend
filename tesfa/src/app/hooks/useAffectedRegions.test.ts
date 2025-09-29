
import { renderHook, waitFor } from '@testing-library/react';
import { useAffectedCountries } from './useAffectedRegions';
import { fetchAffectedCountries } from '../utils/fetchAffectedCountries';

jest.mock('../utils/fetchAffectedCountries', () => ({
  fetchAffectedCountries: jest.fn(),
}));

describe('useAffectedCountries', () => {
  const mockCountries = [
    {
      country_id: 'US',
      country_name: 'United States',
      is_affected: true,
      geometry: {},
    },
    {
      country_id: 'CA',
      country_name: 'Canada',
      is_affected: false,
      geometry: {},
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially and fetch data successfully', async () => {
    (fetchAffectedCountries as jest.Mock).mockResolvedValue(mockCountries);

    const { result } = renderHook(() => useAffectedCountries());

   
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();


    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.data).toEqual(mockCountries);
    expect(result.current.error).toBeNull();
    expect(fetchAffectedCountries).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors gracefully', async () => {
    const errorMessage = 'Failed to fetch countries: Not Found';
    (fetchAffectedCountries as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAffectedCountries());


    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });

  it('should handle authentication errors', async () => {
    const authError = 'User is not authenticated';
    (fetchAffectedCountries as jest.Mock).mockRejectedValue(new Error(authError));

    const { result } = renderHook(() => useAffectedCountries());

    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.error).toBe(authError);
    expect(result.current.data).toEqual([]);
  });
});