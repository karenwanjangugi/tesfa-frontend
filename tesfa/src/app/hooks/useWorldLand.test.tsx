import { renderHook, waitFor } from '@testing-library/react';
import useWorldLand from './useWorldLand';
import { fetchWorldLand } from '../utils/fetchWorldLand';
jest.mock('../utils/fetchWorldLand');
describe('useWorldLand', () => {
  beforeEach(() => {
    (fetchWorldLand as jest.Mock).mockClear();
  });
  it('sets loading to true initially', () => {
    const { result } = renderHook(() => useWorldLand());
    expect(result.current.loading).toBe(true);
    expect(result.current.worldLand).toBeNull();
    expect(result.current.error).toBeNull();
  });
  it('sets worldLand data on successful fetch', async () => {
    const mockData = { id: 1, name: 'Earth' };
    (fetchWorldLand as jest.Mock).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useWorldLand());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.worldLand).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
  it('sets error on fetch failure', async () => {
    const errorMessage = 'Failed to fetch world land';
    (fetchWorldLand as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useWorldLand());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.worldLand).toBeNull();
  });
});