import { renderHook, act } from '@testing-library/react';
import { usePredictions } from './usePrediction';
import { fetchPredictions } from '../utils/fetchPredictions';

jest.mock('../utils/fetchPredictions', () => ({
  fetchPredictions: jest.fn(),
}));

describe('usePredictions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads predictions successfully', async () => {
    const mockData = [{ prediction_id: 1, description: "Outbreak" }];
    (fetchPredictions as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePredictions());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve(); 
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.predictions).toEqual(mockData);
  });
});