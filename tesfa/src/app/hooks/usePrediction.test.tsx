import { renderHook, act } from '@testing-library/react';
import { usePredictions } from './usePrediction'; 
import { fetchPredictions } from '../utils/fetchPredictions';

jest.mock('../utils/fetchPredictions', () => ({
  fetchPredictions: jest.fn(),
}));


const mockPredictionData = [
  {
    prediction_id: 1,
    description: 'Outbreak in region X',
    disease_risks: [
      { disease_name: 'Malaria', risk_level: 'High', risk_percent: 85 },
      { disease_name: 'Dengue', risk_level: 'Medium', risk_percent: 45 },
    ],
    date_generated: '2024-05-01T10:00:00Z',
    agent: { name: 'AI Model v2' },
    region: 'East Africa',
    country: 'Kenya',
    lng: 36.8219,
    lat: -1.2921,
  },
];

describe('usePredictions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads predictions successfully', async () => {
    (fetchPredictions as jest.Mock).mockResolvedValue(mockPredictionData);

    const { result } = renderHook(() => usePredictions());


    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.predictions).toEqual([]);

    await act(async () => {
      await Promise.resolve(); 
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.predictions).toEqual(mockPredictionData);
  });

  test('handles empty predictions response', async () => {
    (fetchPredictions as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => usePredictions());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.predictions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test('handles fetch error gracefully', async () => {
    const errorMessage = 'Failed to fetch predictions';
    (fetchPredictions as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePredictions());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.predictions).toEqual([]);
  });

  test('ensures loading is false after resolution regardless of outcome', async () => {

    (fetchPredictions as jest.Mock).mockResolvedValue(mockPredictionData);
    const { result: successResult } = renderHook(() => usePredictions());
    await act(async () => await Promise.resolve());
    expect(successResult.current.loading).toBe(false);

    (fetchPredictions as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result: errorResult } = renderHook(() => usePredictions());
    await act(async () => await Promise.resolve());
    expect(errorResult.current.loading).toBe(false);
  });
});