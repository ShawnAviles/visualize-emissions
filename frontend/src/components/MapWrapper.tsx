import Map, { Source, Layer, Marker, ScaleControl } from 'react-map-gl';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
import type { LayerProps } from 'react-map-gl';

import { useState, useEffect } from 'react';
import ScopeMenu from './ScopeMenu';
import routes from '../utility/sampleData/routePolylines/simple_routes_5.json';
import routeLayers from '../utility/sampleData/routeLayers/simple_routes_5_layers.json';
import useGeoJson from '../hooks/useGeoJson.tsx';
import useMetrics from '../hooks/useMetrics.tsx';
import { generateRouteLayer } from '../utility/helper';
import Barplot from './Barplot.tsx';
import PieChart from './PieChart.tsx';
import ViolinPlot from './ViolinPlot.tsx';

// Used this to test the liveRoutes data as it is saved locally, atp it is just an extra sample data file:
// import liveRoutesStatic from '../utility/sampleData/routePolylines/routes_gcp_28.json';
// import liveRoutesLayersStatic from '../utility/sampleData/routeLayers/routes_gcp_28_layers.json';

type TransportationModes =
  | 'DRIVE'
  | 'TRAIN'
  | 'SUBWAY'
  | 'LIGHT_RAIL'
  | 'BUS'
  | 'WALK'
  | 'BICYCLE';

function MenuWrapper() {
  const mapboxToken: string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude: number = -74.02414311907891;
  const StevensLatitude: number = 40.74509007605575;
  const [uploadedData, setUploadedData] = useState({ data: [], errors: [], meta: [] });
  const [sources, setSources] = useState([] as React.ReactElement[]);
  const [modeFilter, setModeFilter] = useState('all');
  const [availableModes, setAvailableModes] = useState([] as string[]);

  const {
    loading: geoJsonLoading,
    error: geoJsonError,
    liveRoutesObject
  } = useGeoJson('http://localhost:3000/routes', uploadedData);

  const {
    loading: metricsLoading,
    error: metricsError,
    metrics
  } = useMetrics('http://localhost:3000/metrics', uploadedData);

  // @h-pyo
  // TODO: Remove this. This is just for logging and showing how to use
  // the custom useMetrics hook to get metrics data
  useEffect(() => {
    console.log('metrics', metrics);
    console.log('loadingState for metrics', metricsLoading);
    console.log('errorState for metrics', metricsError);
  }, [metrics]);

  useEffect(() => {
    if (Object.keys(liveRoutesObject).length > 0) {
      const modes = Object.keys(liveRoutesObject);
      setAvailableModes(modes);
    }
  }, [liveRoutesObject]);

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
        if (modeFilter !== 'all' && modeFilter !== mode) {
          // Skip if modeFilter is set and the current mode is not the selected one
          continue;
        }

        let liveRoutes: object[] = liveRoutesObject[mode];
        let liveRoutesLayers = generateRouteLayer(liveRoutes, {
          modeOfTransport: mode as TransportationModes
        });

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
      // TODO: Remove later
      console.log('CREATED', sources);
      setSources(sources);
    };

    renderPolyline();
  }, [liveRoutesObject, modeFilter]);

  return (
    <>
      <div className="h-[80vh] w-screen flex justify-center items-center px-16">
        <div className="h-full w-full rounded-lg border-sky-400 bg-gradient-to-r to-emerald-600 from-sky-400 p-1">
          <div className="relative h-full w-full">
            <ScopeMenu
              setUploadedData={setUploadedData}
              loading={geoJsonLoading}
              error={geoJsonError}
              setModeFilter={setModeFilter} // Pass the setModeFilter function to ScopeMenu
              availableModes={availableModes} // Pass availableModes to ScopeMenu
            />
            <Map
              mapboxAccessToken={mapboxToken}
              initialViewState={{
                longitude: StevensLongitude,
                latitude: StevensLatitude,
                zoom: 10
              }}
              style={{
                width: '100%',
                height: '100%',
                filter: geoJsonLoading ? 'blur(4px)' : 'none'
              }}
              mapStyle="mapbox://styles/mapbox/light-v11"
            >
              <Marker
                longitude={StevensLongitude}
                latitude={StevensLatitude}
                color="#b30538"
                anchor="center"
              />
              <ScaleControl unit="imperial" />
              {sources.length > 0 && sources}
            </Map>
          </div>
        </div>
      </div>

      {metricsLoading ? (
        <>
          <div className="p-8 flex flex-col justify-center items-center italics text-primary text-[11pt]">
            Loading Metrics...
            <span className="loading loading-spinner loading-lg mt-2"></span>
          </div>
        </>
      ) : (
        <>
          {metrics[0] && (
            <Barplot data={metrics[0] as { name: string; value: number }[]} />
          )}
          {metrics[0] && (
            <PieChart data={metrics[0] as { name: string; value: number }[]} />
          )}
          {metrics[1] && (
            <ViolinPlot
              data={metrics[1] as { name: string; value: number }[]}
              width={800}
              height={500}
            />
          )}
        </>
      )}
    </>
  );
}

export default MenuWrapper;
