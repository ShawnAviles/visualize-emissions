import Map, { Source, Layer, Marker } from 'react-map-gl';
import ScopeMenu from './ScopeMenu';
import routes from '../utility/sampleData/routePolylines/simple_routes_5.json';
import routeLayers from '../utility/sampleData/routeLayers/simple_routes_5_layers.json';
import { useState, useEffect } from 'react';
import { extractUniqueZipCodes, generateRouteLayer } from '../utility/helper';
// Used this to test the liveRoutes data as it is saved locally:
// import liveRoutesStatic from '../utility/routePolylines/routes_gcp_28.json';
// import liveRoutesLayersStatic from '../utility/routeLayers/routes_gcp_28_layers.json';

function MenuWrapper() {
  const mapboxToken: string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude: number = -74.02414311907891;
  const StevensLatitude: number = 40.74509007605575;

  const [uploadedData, setUploadedData] = useState({ data: [], errors: [], meta: [] });
  const [liveRoutes, setLiveRoutes] = useState([]);

  useEffect(() => {
    // check if object is empty
    if (uploadedData.data.length === 0) return;

    let table = (uploadedData as { data: any[]; errors: any[]; meta: any[] }).data;

    const zipCodes = extractUniqueZipCodes(table);

    const getRoutes = async (zipCodes: any) => {
      // commenting out for now to not make excessive calls on each load
      const response = await fetch('http://localhost:3000/routes', {
        method: 'POST',
        body: JSON.stringify(zipCodes),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      setLiveRoutes(res.data);
      //console.log("Commenting out fetch call to avoid excessive calls on each load.")
    };

    getRoutes(zipCodes); // function call to server
  }, [uploadedData]);

  const renderPolylines = () => {
    // conditional render of the polylines based on liveRoutes variable, else render using routesLayers.json
    if (liveRoutes.length > 0) {
      // create custom layer object based on liveRoutes data, this must be unique for each set of route data uploaded
      let liveRoutesLayers = generateRouteLayer(liveRoutes, { color: '#4A89F3' });

      // note: Source id must be the same as the bottom, there can only be one source (from what ik know), layer key must be unique
      return (
        <Source
          id="my-data"
          type="geojson"
          data={{ type: 'FeatureCollection', features: liveRoutes }}
        >
          {liveRoutesLayers.map((layer, index) => (
            <Layer key={index + liveRoutesLayers.length} {...layer} />
          ))}
        </Source>
      );
    }
    return (
      <Source
        id="my-data"
        type="geojson"
        data={{ type: 'FeatureCollection', features: routes }}
      >
        {routeLayers.map((layer, index) => (
          <Layer key={index} {...layer} />
        ))}
      </Source>
    );
  };

  return (
    <Map
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: StevensLongitude,
        latitude: StevensLatitude,
        zoom: 10
      }}
      style={{ width: '100vw', height: '80vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <ScopeMenu setUploadedData={setUploadedData} />
      <Marker
        longitude={StevensLongitude}
        latitude={StevensLatitude}
        color="#b30538"
        anchor="bottom"
      />
      {renderPolylines()}
    </Map>
  );
}

export default MenuWrapper;
