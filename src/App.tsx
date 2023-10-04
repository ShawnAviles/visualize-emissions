import Map from 'react-map-gl';
import Menu from './components/Menu';

function App() {
  const mapboxToken : string = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <>
      <Menu />
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: -74.02414311907891,
          latitude: 40.74509007605575,
          zoom: 10,
        }}
        style={{ width: '100vw', height: '80vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      />
    </>
  );
}

export default App;
