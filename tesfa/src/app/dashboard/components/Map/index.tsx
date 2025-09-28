'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import L, { Layer, Path } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCountries } from '../../../hooks/useCountries';
import { useRegions } from '../../../hooks/useRegions';
import { usePredictions } from '../../../hooks/usePrediction';

const applyStyle = (layer: Layer, opacity: number) => {
  if ((layer as Path).setStyle) {
    (layer as Path).setStyle({ fillOpacity: opacity });
  }
};

const MapClient = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const geoJsonLayersRef = useRef<{
    worldLand?: L.GeoJSON;
    countries?: L.GeoJSON;
    regions?: L.GeoJSON;
  }>({});

  const [hoveredFeature, setHoveredFeature] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [worldLand, setWorldLand] = useState<any>(null); 

  const { countries, loading: loadingC } = useCountries();
  const { regions, loading: loadingR } = useRegions();
  const { predictions } = usePredictions();


  useEffect(() => {
    fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson  ')
      .then((res) => res.json())
      .then((data) => setWorldLand(data))
      .catch((err) => console.error('Failed to load world land GeoJSON:', err));
  }, []);

  const createGeoJsonLayers = useCallback(() => {
    if (!leafletMapRef.current) return;

    if (geoJsonLayersRef.current.worldLand) {
      leafletMapRef.current.removeLayer(geoJsonLayersRef.current.worldLand);
    }
    if (geoJsonLayersRef.current.countries) {
      leafletMapRef.current.removeLayer(geoJsonLayersRef.current.countries);
    }
    if (geoJsonLayersRef.current.regions) {
      leafletMapRef.current.removeLayer(geoJsonLayersRef.current.regions);
    }

    if (worldLand) {
      const worldLandLayer = L.geoJSON(worldLand, {
        style: {
          fillColor: '#808080',
          fillOpacity: 1,
          weight: 0,
          color: 'transparent',
        },
        onEachFeature: (feature, layer) => {
          if (layer instanceof L.Path) {
            const element = layer.getElement();
            if (element) {
              (element as SVGPathElement).style.filter = 'hue-rotate(180deg) brightness(0) saturate(0)';
            }
          }
        },
      }).addTo(leafletMapRef.current);

      geoJsonLayersRef.current.worldLand = worldLandLayer;
    }

    if (countries.length > 0) {
      const countryLayer = L.geoJSON(
        countries.map((c) => ({
          type: 'Feature',
          properties: { ...c, color: c.is_affected ? '#e53e3e' : '#0f4c75' },
          geometry: c.geometry,
        })),
        {
          style: (feature) => ({
            fillColor: feature?.properties?.color || '#0f4c75',
            weight: 0.5,
            opacity: 1,
            color: '#ffffff', 
            fillOpacity: 1,
          }),
          onEachFeature: (feature, layer) => {
            if (!feature) return;

            layer.on('mouseover', () => {
              setHoveredFeature(feature);
              applyStyle(layer, 1);
            });

            layer.on('mouseout', () => {
              setHoveredFeature(null);
              applyStyle(layer, 0.8);
            });
          },
        }
      ).addTo(leafletMapRef.current);

      geoJsonLayersRef.current.countries = countryLayer;
    }

    if (regions.length > 0) {
      const regionLayer = L.geoJSON(
        regions.map((r) => ({
          type: 'Feature',
          properties: { ...r, color: r.is_affected ? '#e53e3e' : '#00353D' },
          geometry: r.geometry,
        })),
        {
          style: (feature) => ({
            fillColor: feature?.properties?.color || '#00353D',
            weight: 0.3,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: 0.6,
          }),
          onEachFeature: (feature, layer) => {
            if (!feature) return;

            layer.on('mouseover', () => {
              setHoveredFeature(feature);
              applyStyle(layer, 0.9);
            });

            layer.on('mouseout', () => {
              setHoveredFeature(null);
              applyStyle(layer, 0.6);
            });
          },
        }
      );
      geoJsonLayersRef.current.regions = regionLayer;
    }
  }, [countries, regions, worldLand]); 

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [7, 36],
      zoom: 2,
      minZoom: 5,
      maxZoom: 12,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    leafletMapRef.current = map;
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.setMaxBounds([
      [-90, -180],
      [90, 180],
    ]);

    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      const regionsLayer = geoJsonLayersRef.current.regions;

      if (currentZoom >= 6 && regionsLayer && !map.hasLayer(regionsLayer)) {
        map.addLayer(regionsLayer);
      } else if (currentZoom < 6 && regionsLayer && map.hasLayer(regionsLayer)) {
        map.removeLayer(regionsLayer);
      }
    };

    map.on('zoomend', handleZoomEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (leafletMapRef.current && !loadingC && !loadingR) {
      createGeoJsonLayers();
    }
  }, [createGeoJsonLayers, loadingC, loadingR]);

  const getRiskInfo = () => {
    if (!hoveredFeature) return null;
    const id = hoveredFeature.properties?.country_id || hoveredFeature.properties?.region_id;
    const pred = predictions.find((p) => p.country === id || p.region === id);
    return pred ? pred.disease_risks : ['No health risks in this area.'];
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={mapRef}
        className="w-full h-full ml-[-20px]"
        onMouseMove={(e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
      />
      {hoveredFeature && (
        <div
          className="absolute bg-yellow-500 text-gray-900 p-4 rounded-lg shadow-lg max-w-xs z-[1000] pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y + 10,
            transition: 'all 0.1s ease',
          }}
        >
          <h3 className="font-bold">
            {hoveredFeature.properties?.countries_name || hoveredFeature.properties?.region_name}
          </h3>
          <div className="mt-2 space-y-1">
            {getRiskInfo()?.map((risk, i) => (
              <p key={i} className="text-xs">
                {risk}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapClient;