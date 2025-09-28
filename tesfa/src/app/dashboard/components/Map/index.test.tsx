import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MapClient from '.';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ type: 'FeatureCollection', features: [] }),
    })
  ) as jest.Mock;
});

afterAll(() => {
  (global.fetch as jest.Mock).mockClear();
  delete (global as any).fetch;
});

jest.mock('leaflet', () => {
  const mapInstance = {
    setMaxBounds: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    getZoom: jest.fn(() => 2),
    hasLayer: jest.fn(() => false),
    remove: jest.fn(),
  };

  const geoJsonLayer = jest.fn(() => ({
    addTo: jest.fn(() => mapInstance),
    on: jest.fn(),
  }));

  return {
    map: jest.fn(() => mapInstance),
    tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
    control: {
      zoom: jest.fn(() => ({ addTo: jest.fn() })),
    },
    geoJSON: geoJsonLayer,
    Path: jest.fn(),
  };
});

jest.mock('../../../hooks/useCountries', () => ({
  useCountries: () => ({ countries: [], loading: false }),
}));

jest.mock('../../../hooks/useRegions', () => ({
  useRegions: () => ({ regions: [], loading: false }),
}));

jest.mock('../../../hooks/usePrediction', () => ({
  usePredictions: () => ({ predictions: [] }),
}));

describe('MapClient Component', () => {
  test('renders map container and handles mouse move without errors', async () => {
    const { container } = render(<MapClient />);

    await waitFor(() => {
      const mapContainer = container.querySelector('.relative.w-full.h-full.overflow-hidden');
      expect(mapContainer).toBeInTheDocument();

      if (mapContainer) {
        fireEvent.mouseMove(mapContainer, { clientX: 100, clientY: 200 });
      }
    });
  });
});