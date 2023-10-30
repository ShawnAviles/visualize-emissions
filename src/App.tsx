import Map, {Marker} from 'react-map-gl';
import Menu from './components/Menu';
import mapIcon from './assets/map-icon.jpg';

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
      > 
        <Marker longitude={-74.02414311907891} latitude={40.74509007605575} anchor='bottom'>
          {/* <img className='w-4 h-4' src={mapIcon} /> */}
        </Marker>
      </ Map>
    </>
  );
}

export default App;
