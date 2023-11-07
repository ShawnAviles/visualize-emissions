/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
// import { useEffect, useState } from 'react';
import { useState } from 'react';
import Menu from './components/Menu';
import MapWrapper from './components/MapWrapper';
import routes from './components/Routes.json';

function App() {
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
      <button 
        type="button" 
        className="w-32 flex justify-center bg-blue-100 p-3 mb-4 rounded-lg" 
        onClick={() => setRounteNum((routeNum + 1) % routes.length)}
      >
        Toggle Route
      </button>
      <MapWrapper routeNum={routeNum}/>
    </>
  );
}

export default App;
