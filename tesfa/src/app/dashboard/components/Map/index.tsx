'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import L, { Layer, Path } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';

import { useCountries } from '../../../hooks/useCountries';
import { useRegions } from '../../../hooks/useRegions';
import { usePredictions} from '../../../hooks/usePrediction';
import {DiseaseRisk, Prediction} from '../../../utils/type';
import useWorldLand from '../../../hooks/useWorldLand';

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

  const { countries, loading: loadingC } = useCountries();
  const { regions, loading: loadingR } = useRegions();
  const { predictions } = usePredictions();

  const { worldLand, loading: loadingW, error: errorW } = useWorldLand();

  const createGeoJsonLayers = useCallback(() => {
    if (!leafletMapRef.current) return;

    Object.values(geoJsonLayersRef.current).forEach((layer) => {
      if (layer && leafletMapRef.current?.hasLayer(layer)) {
        leafletMapRef.current.removeLayer(layer);
      }
    });

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
              (element as SVGPathElement).style.filter =
                'hue-rotate(180deg) brightness(0) saturate(0)';
            }
          }
        },
      }).addTo(leafletMapRef.current);

      geoJsonLayersRef.current.worldLand = worldLandLayer;
    }

    if (countries.length > 0) {
      const validCountries = countries.filter(
        (country) => country.geometry && typeof country.geometry === 'object' && country.geometry.type
      );

      if (validCountries.length > 0) {
        const countryFeatures: FeatureCollection<Geometry, any> = {
          type: 'FeatureCollection',
          features: validCountries.map((country) => ({
            type: 'Feature',
            properties: { ...country, color: country.is_affected ? '#e53e3e' : '#0f4c75' },
            geometry: country.geometry,
          })),
        };

        const countryLayer = L.geoJSON(countryFeatures, {
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
        }).addTo(leafletMapRef.current);

        geoJsonLayersRef.current.countries = countryLayer;
      }
    }

    if (regions.length > 0) {
      const validRegions = regions.filter(
        (region) => region.geometry && typeof region.geometry === 'object' && region.geometry.type
      );

      if (validRegions.length > 0) {
        const regionFeatures: FeatureCollection<Geometry, any> = {
          type: 'FeatureCollection',
          features: validRegions.map((region) => ({
            type: 'Feature',
            properties: { ...region, color: region.is_affected ? '#e53e3e' : '#00353D' },
            geometry: region.geometry,
          })),
        };

        const regionLayer = L.geoJSON(regionFeatures, {
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
        });

        geoJsonLayersRef.current.regions = regionLayer;

        const currentZoom = leafletMapRef.current.getZoom();
        if (currentZoom >= 6 && !leafletMapRef.current.hasLayer(regionLayer)) {
          leafletMapRef.current.addLayer(regionLayer);
        }
      }
    }
  }, [countries, regions, worldLand]);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [10, 36],
      zoom: 1,
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
    if (leafletMapRef.current && !loadingC && !loadingR && !loadingW && !errorW) {
      createGeoJsonLayers();
    }
  }, [createGeoJsonLayers, loadingC, loadingR, loadingW, errorW]);

  const getPredictionInfo = (): Prediction | null => {
    if (!hoveredFeature) return null;
    const id = hoveredFeature.properties?.country_id || hoveredFeature.properties?.region_id;
    const pred = predictions.find((prediction) => prediction.country === id || prediction.region === id);
    return pred || null;
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
            {(() => {
              const predictionInfo = getPredictionInfo();
              const risks = predictionInfo?.disease_risks;

              if (predictionInfo?.description) {
                return (
                  <>
                    <p className="text-xs">{predictionInfo.description}</p>
                    {!risks || risks.length === 0 ? (
                      <p className="text-xs">No health risks in this area.</p>
                    ) : (
                      <table className="mt-2 text-xs border-collapse border border-gray-400 w-full">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-1">Disease</th>
                            <th className="border border-gray-400 px-1">Risk Level</th>
                            <th className="border border-gray-400 px-1">Risk %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(risks as Array<DiseaseRisk | string>).map((item, i) => {
                            if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                              return (
                                <tr key={i} className="even:bg-gray-100">
                                  <td className="border border-gray-400 px-1">
                                    {item.disease_name ?? 'Unknown'}
                                  </td>
                                  <td className="border border-gray-400 px-1">
                                    {item.risk_level ?? 'Unknown'}
                                  </td>
                                  <td className="border border-gray-400 px-1 text-right">
                                    {typeof item.risk_percent === 'number'
                                      ? `${item.risk_percent}%`
                                      : 'N/A'}
                                  </td>
                                </tr>
                              );
                            }
                            return (
                              <tr key={i} className="even:bg-gray-100">
                                <td className="border border-gray-400 px-1" colSpan={3}>
                                  {String(item)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </>
                );
              }

              if (!risks || risks.length === 0) {
                return <p className="text-xs">No health risks in this area.</p>;
              }

              return (risks as Array<DiseaseRisk | string>).map((item, i) => {
                if (typeof item === 'object' && item !== null) {
                  return (
                    <p key={i} className="text-xs">
                      <strong>{item.disease_name ?? ''}:</strong> {item.risk_level ?? 'Unknown level'}
                    </p>
                  );
                }
                return <p key={i} className="text-xs">{String(item)}</p>;
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapClient;
