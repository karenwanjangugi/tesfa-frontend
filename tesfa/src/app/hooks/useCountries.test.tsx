import { renderHook, waitFor } from '@testing-library/react'; 
import { useCountries } from './useCountries';
import { fetchCountries } from '../utils/fetchCountries';

jest.mock('../utils/fetchCountries', () => ({
  fetchCountries: jest.fn(),
}));

const mockCountries = [
  {
    country_id: 'US',
    countries_name: 'United States',
    geometry: { type: 'Polygon', coordinates: [] },
    is_affected: true,
  },
  {
    country_id: 'CA',
    countries_name: 'Canada',
    geometry: { type: 'Polygon', coordinates: [] },
    is_affected: false,
  },
];

describe('useCountries Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initially loading is true, countries is empty, error is null', () => {
    const { result } = renderHook(() => useCountries());

    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test('loads countries successfully', async () => {
    (fetchCountries as jest.Mock).mockResolvedValue(mockCountries);

    const { result } = renderHook(() => useCountries());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBeNull();
  });

  test('handles error when fetch fails', async () => {
    const errorMessage = 'Network Error';
    (fetchCountries as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCountries());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.countries).toEqual([]);
  });
});