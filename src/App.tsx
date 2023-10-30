/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import Map, { Source, Layer, Marker } from 'react-map-gl';
// import { useEffect, useState } from 'react';
import { useState } from 'react';
import Menu from './components/Menu';
import routes from './components/Routes.json';
import routeLayers from './components/RouteLayers.json';
import mapIcon from './assets/map-icon.jpg';

function App() {
  const mapboxToken : string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude : number = -74.02414311907891;
  const StevensLatitude : number = 40.74509007605575;
  const [routeNum, setRounteNum] = useState(0);

  /*
  const urlBase : string = 'https://api.mapbox.com/isochrone/v1/mapbox/';
  const profile : string = 'driving';
  const maxMinutes : number = 44;
  const [maxQuery, setMaxQuery] = useState({});

  useEffect(() => {
    fetch(
      `${urlBase}${profile}/${StevensLongitude},${StevensLatitude}?contours_minutes=${[maxMinutes]}&polygons=true&access_token=${mapboxToken}`
      , { method: 'GET' })
      .then((data) => data.json())
      .then((data) => setMaQuery(data));
  });
  */
  return (
    <>
      <Menu />
      {/* {create two button to toggle between routes plus and minus} */}
      <button type="button" className="w-32 flex justify-center bg-blue-100 p-3 mb-4 rounded-lg" onClick={() => setRounteNum((routeNum + 1) % routes.length)}>Toggle Route</button>
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: StevensLongitude,
          latitude: StevensLatitude,
          zoom: 10,
        }}
        style={{ width: '100vw', height: '80vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker longitude={StevensLongitude} latitude={StevensLatitude} color="#b30538" anchor="bottom" />
        <Source id="my-data1" type="geojson" data={routes[routeNum]}>
          <Layer {...routeLayers[routeNum]} />
        </Source>
        {/* <Source id="my-data2" type="geojson" data={routes[1]}>
          <Layer {...routeLayers[1]} />
        </Source> */}
      </Map>
    </>
  );
}

export default App;
