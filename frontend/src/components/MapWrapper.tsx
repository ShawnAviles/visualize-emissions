import propTypes from 'prop-types';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import ScopeMenu from './ScopeMenu';
import routes from './Routes.json';
import routeLayers from './RouteLayers.json';
import { useEffect } from 'react';


function MenuWrapper({ routeNum } : { routeNum: number }) {
	const mapboxToken : string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude : number = -74.02414311907891;
  const StevensLatitude : number = 40.74509007605575;

	useEffect(() => {
		const getRoutes = async () => {
      const zipCodes = ['10026', '07030']; // TODO: update when we parse files for the zipcodes
			const response = await fetch('http://localhost:3000/routes', { 
        method: 'POST', 
        body: JSON.stringify(zipCodes),
        headers: {
          "Content-Type": "application/json"
        }
      });
			const data = await response.json();
			console.log(data);
		};
		getRoutes(); 
    // TODO: implement this into mapbox but for not you can open up the console to see the 
    // returned polyline from the server
	}, []);

	return (
		<Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: StevensLongitude,
          latitude: StevensLatitude,
          zoom: 10,
        }}
        style={{ width: '100vw', height: '80vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <ScopeMenu />
        <Marker longitude={StevensLongitude} latitude={StevensLatitude} color="#b30538" anchor="bottom" />
        <Source id="my-data1" type="geojson" data={routes[routeNum]}>
          <Layer {...routeLayers[routeNum]} />
        </Source>
        {/* <Source id="my-data2" type="geojson" data={routes[1]}>
          <Layer {...routeLayers[1]} />
        </Source> */}
      </Map>
	);
}

MenuWrapper.propTypes = {
	routeNum: propTypes.number.isRequired
}

export default MenuWrapper