import { renderHook, act } from '@testing-library/react'; 
import { useRegions } from './useRegions';
import { fetchRegions } from '../utils/fetchRegions';

jest.mock('../utils/fetchRegions', () => ({
  fetchRegions: jest.fn(),
}));

const mockRegions = [
  {
    region_id: 'R1',
    region_name: 'Southeast Asia',
    country: 'Thailand',
    geometry: { type: 'Polygon', coordinates: [] },
    is_affected: true,
  },
  {
    region_id: 'R2',
    region_name: 'West Africa',
    country: 'Nigeria',
    geometry: { type: 'Polygon', coordinates: [] },
    is_affected: false,
  },
];

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));
describe('useRegions Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state: loading true, regions empty, error null', () => {
    const { result } = renderHook(() => useRegions());

    expect(result.current.loading).toBe(true);
    expect(result.current.regions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test('loads regions successfully', async () => {
    (fetchRegions as jest.Mock).mockResolvedValue(mockRegions);

    const { result } = renderHook(() => useRegions());
    await act(async () => {
      await flushPromises(); 
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.regions).toEqual(mockRegions);
    expect(result.current.error).toBeNull();
  });

  test('handles error when fetch fails', async () => {
    const errorMessage = 'Failed to load regions';
    (fetchRegions as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useRegions());
    await act(async () => {
      await flushPromises(); 
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.regions).toEqual([]);
  });
});