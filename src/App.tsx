import Map, { Marker } from 'react-map-gl'; import Menu from './components/Menu';

function App() {
  const mapboxToken : string = import.meta.env.VITE_MAPBOX_TOKEN;
  const StevensLongitude : number = -74.02414311907891;
  const StevensLatitude : number = 40.74509007605575;

  return (
    <>
      <Menu />
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
        <Marker longitude={StevensLongitude} latitude={StevensLatitude} color="red" anchor="bottom" />
      </Map>
    </>
  );
}

export default App;
