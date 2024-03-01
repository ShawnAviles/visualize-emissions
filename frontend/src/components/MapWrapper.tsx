import Map, { Source, Layer, Marker, ScaleControl } from 'react-map-gl';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
import type { LayerProps } from 'react-map-gl';

import { useState, useEffect } from 'react';
import ScopeMenu from './ScopeMenu';
import routes from '../utility/sampleData/routePolylines/simple_routes_5.json';
import routeLayers from '../utility/sampleData/routeLayers/simple_routes_5_layers.json';
import useGeoJson from '../hooks/useGeoJson.tsx';
import { generateRouteLayer } from '../utility/helper';

// Used this to test the liveRoutes data as it is saved locally, atp it is just an extra sample data file:
// import liveRoutesStatic from '../utility/sampleData/routePolylines/routes_gcp_28.json';
// import liveRoutesLayersStatic from '../utility/sampleData/routeLayers/routes_gcp_28_layers.json';

function MenuWrapper() {
  const mapboxToken: string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude: number = -74.02414311907891;
  const StevensLatitude: number = 40.74509007605575;
  const [sources, setSources] = useState([] as React.ReactElement[]);

  const { loading, error, liveRoutesObject, setUploadedData } = useGeoJson(
    'http://localhost:3000/routes'
  );

  useEffect(() => {
    const renderPolyline = () => {
      // conditional render of the polylines based on liveRoutes variable, else render using routesLayers.json
      if (Object.keys(liveRoutesObject).length === 0) {
        setSources([
          <Source
            id="my-data"
            key="my-data"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: routes as Feature<Geometry, GeoJsonProperties>[]
            }}
          >
            {routeLayers.map((layer, index) => (
              <Layer key={index} {...(layer as LayerProps)} />
            ))}
          </Source>
        ]);
        return;
      }
      // create custom layer object based on liveRoutes data, this must be unique for each set of route data uploaded
      const sources: React.ReactElement[] = [];
      const existingModesOfTransport = Object.keys(liveRoutesObject);
      for (let mode of existingModesOfTransport) {
        let liveRoutes: object[] = liveRoutesObject[mode];
        let liveRoutesLayers = generateRouteLayer(liveRoutes, { modeOfTransport: mode });
        sources.push(
          <Source
            id={mode}
            key={mode}
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: liveRoutes as Feature<Geometry, GeoJsonProperties>[]
            }}
            lineMetrics={true}
          >
            {liveRoutesLayers.map((layer, index) => (
              <Layer key={index} {...(layer as LayerProps)} />
            ))}
          </Source>
        );
      }
      console.log('CREATED', sources);
      setSources(sources);
    };
    renderPolyline();
  }, [liveRoutesObject]);

  return (
    <Map
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: StevensLongitude,
        latitude: StevensLatitude,
        zoom: 10
      }}
      style={{ width: '100vw', height: '80vh' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
    >
      <ScopeMenu setUploadedData={setUploadedData} loading={loading} error={error} />
      <Marker
        longitude={StevensLongitude}
        latitude={StevensLatitude}
        color="#b30538"
        anchor="bottom"
      />
      <ScaleControl unit="imperial" />
      {sources.length > 0 && sources}
    </Map>
  );
}

export default MenuWrapper;
